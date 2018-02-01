'use strict';

const AWS = require('aws-sdk');
const walk = require('walk');
const mime = require('mime-types');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const crypto = require('crypto');

const targets = {
    dev: {
        bucket: 'vfs-apps',
        prefix: path.join('viewer','dev')
    },

    test: {
        bucket: 'vfs-apps',
        prefix: path.join('viewer','test')
    },

    beta: {
        bucket: 'vfs-apps',
        prefix: path.join('viewer','beta')
    },

    prod: {
        bucket: 'vfs-apps',
        prefix: path.join('viewer','prod')
    }
};

module.exports = function(grunt) {

    var stageName = grunt.option('target') || 'dev';
    var s3 = new AWS.S3();
    var flags = {
      debug: grunt.option('with-debug') || false,
      confirm: !(grunt.option('confirm') === false),
      version: grunt.option('versionTag'),
      target: targets[stageName]
    };

    if(!flags.target)
        throw new Error("Invalid target selected. ABORT");

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean: {
            options: { force: true },
            build: [ 'build/**', '.temp/**' ],
        },

        sync: {
            html: {
                files: [{
                    cwd: 'src/',
                    dest: 'build/',
                    src: [ '*.html', 'Modules/**/templates/*.html' ]
                }]
            },

            images: {
                files: [{
                    cwd: 'src/',
                    dest: 'build/',
                    src: 'Assets/images/**'
                }]
            },

            json: {
                files: [{
                    cwd: 'src/',
                    dest: 'build/',
                    src: '*.json'
                }]
            },

            pdfViewer: {
                files: [{
                    cwd: 'src/',
                    dest: 'build/',
                    src: 'pdf.js-viewer/**'
                }]
            }

        },

        uglify: {

            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                screwIE8: true,
                mangle: false,
                mangleProperties: false,
                reserveDOMCache: true,
                sourceMap: true,
            },

            release: {
                files: {
                    'build/site.min.js': [
                        'src/*.js',
                        'config.js',
                        './src/Modules/**/controllers/*.js',
                        './src/Modules/**/services/*.js',
                        './src/Modules/_global/directives/*.js',
                    ]
                }
            },

            devel: {
                files: {
                    'build/site.min.js': [
                        'src/*.js',
                        'config.js',
                        './src/Modules/**/controllers/*.js',
                        './src/Modules/**/services/*.js',
                        './src/Modules/_global/directives/*.js',
                    ]
                },
                options: {
                    beautify: {
                        width: 80,
                        beautify: true
                    }
                }
            }
        },

        cssmin: {
            release: {
                files: {
                    'build/site.min.css': [ '.temp/*.css' ]
                },
                options: {
                    sourceMap: true
                }
            },

            devel: {
                files: {
                    'build/site.min.css': [ '.temp/*.css' ]
                },
                options: {
                    sourceMap: true
                }
            }
        },

        sass: {
            options: {
                sourceMap: true
            },
            build: {
                files: {
                    '.temp/site.css': 'src/Assets/styles/site.scss'
                }
            }
        },

        watch: {
            options: {
                interrupt: true,
                atBegin: true
            },

            js: {
                files: [
                    'config.js',
                    'src/*.js',
                    'src/Modules/**/controllers/*.js',
                    'src/Modules/**/services/*.js',
                    'src/Modules/_global/directives/*.js',
                ],
                tasks: ['uglify:devel'],
            },

            css: {
                files: [
                    './src/Assets/styles/*.scss',
                    './src/Assets/styles/**/*.scss'
                ],
                tasks: ['sass:build', 'cssmin:devel'],
            },

            html: {
                files: [
                    'src/*.html',
                    'src/Modules/**/templates/*.html'
                ],
                tasks: [ 'sync:html' ],
            },

            images: {
                files: [
                    'src/Assets/images/**'
                ],
                tasks: [ 'sync:images' ],
            },

            json: {
                files: [
                    'src/*.json'
                ],
                tasks: [ 'sync:json' ],
            },

            script: {
                files: [
                    'src/scripts'
                ],
                tasks: [ 'sync:scripts' ],
            }
        },
        prompt: {
          verify: {
          options: {
            questions: [
              {
                config: 'verify',
                type: 'confirm',
                message: 'Are you sure you want to publish VFS.Web to ' + stageName + '?',
                when: function() {
                  if(stageName == "prod" && flags.confirm) {
                    return true;
                  }
                  grunt.config('verify', true);
                  return false;
                }
              }
            ]
          }
        }
      }
    });

    init();

    // -----------------------------------------------------------------------

    function init() {
      grunt.loadNpmTasks('grunt-sync');
      grunt.loadNpmTasks('grunt-contrib-uglify');
      grunt.loadNpmTasks('grunt-contrib-watch');
      grunt.loadNpmTasks('grunt-contrib-cssmin');
      grunt.loadNpmTasks('grunt-sass');
      grunt.loadNpmTasks('grunt-curl');
      grunt.loadNpmTasks('grunt-contrib-clean');
      grunt.loadNpmTasks('grunt-prompt');

      grunt.registerTask('deploy-s3', copy);
      grunt.registerTask('computeCacheGuid', computeCacheGuid);
      grunt.registerTask('confirm', confirm);

      grunt.registerTask('build', [
        'clean:build',
        'uglify:devel',
        'sass:build',
        'cssmin:devel',
        'sync:html',
        'sync:images',
        'sync:json',
        'sync:pdfViewer',
        'computeCacheGuid'
      ]);

      grunt.registerTask('build-release', [
        'clean:build',
        'uglify:release',
        'sass:build',
        'cssmin:release',
        'sync:html',
        'sync:images',
        'sync:json',
        'sync:pdfViewer',
        'computeCacheGuid'
      ]);

      grunt.registerTask('publish', [
        'prompt:verify',
        'confirm',
        'build-release',
        'deploy-s3'
      ]);
    }

    function confirm() {
      if(!grunt.config('verify')) {
        grunt.fail.warn('Did not publish', 1);
      }
    }

    function formatS3Key(key) {
      if(path.sep === '/')
        return key;

      return key.split(path.sep).join('/');
    }

    function computeCacheGuid() {

        /*
         * Create a cache GUID using the output files created by cacheBust
         */

        var sha2Sum = crypto.createHash('sha256');

        var assetPaths = [
            './build/html-assets.json',
            './build/code-assets.json'
        ];

        for(let p of assetPaths) {
            if(!fs.existsSync(p)) continue
            sha2Sum.update(fs.readFileSync(p, {encoding:'utf-8'}));
            fs.unlinkSync(p);
        }

        // If the asset json files don't exist, we are probably doing a local
        // debug build. We just need a consistent hash value.
        sha2Sum.update('PADDING');

        fs.writeFileSync('./build/cacheGuid', sha2Sum.digest('hex'), { encoding: 'utf-8' });

        return true;
    }

    function copy() {

        /* Copy files to s3 and remove orphans */

        // Make this task async to grunt runtime.
        var done = this.async(),
            walker = walk.walk('build'),
            pushedKeys = [];

        var finalizePublish = function notifyUpdate(success) {

            if(!success) return done(success);

            var fpath = path.join(__dirname, 'build', 'cacheGuid');
            var rpath = fpath.replace(path.join(__dirname, 'build'), '').replace(/^\//, '');
            var params = {
                Bucket: flags.target.bucket,
                ACL: 'public-read',
                Key: formatS3Key(path.join(flags.target.prefix, rpath)),
                ContentType: 'text/plain',
                Body: fs.readFileSync(fpath),
                Metadata: {
                    srcVersion: grunt.config.get('pkg').version
                }
            }

            s3.putObject(params, (err, data) => {
                if(err)
                    return next(err);

                console.info("Pushed: " + rpath);
                done(success);
            });
        }

        // Enumerate all files in the build directory and push to s3.
        walker.on("file", function(root, fileStats, next) {
            var fpath = path.join(__dirname, root, fileStats.name);
            var rpath = fpath.replace(path.join(__dirname, 'build'), '').replace(/^\//, '');
            var params = {
                Bucket: flags.target.bucket,
                ACL: 'public-read',
                Key: formatS3Key(path.join(flags.target.prefix, rpath)),
                ContentType: mime.lookup(rpath) || 'text/plain',
                Body: fs.readFileSync(fpath),
                Metadata: {
                    srcVersion: grunt.config.get('pkg').version
                }
            }

            pushedKeys.push(params.Key);

            if(fileStats.name === 'cacheGuid')
                // We dont want to push this but we want to act like we did.
                // The file will be pushed at the very end to avoid the client
                // from refreshing before we are done publishing the changes
                return next();

            s3.putObject(params, (err, data) => {
                if(err)
                    return next(err);

                console.info("Pushed: " + rpath);
                next()
            });
        });

        // After all the files are pushed up, remove any orphans.
        walker.on("end", function() {

            var params = {
                Bucket: flags.target.bucket,
                Prefix: flags.target.prefix
            };

            s3.listObjectsV2(params, (err, data) => {

                if(err) {
                    console.error(err);
                    return finalizePublish(false);
                }

                var params = {
                    Bucket: flags.target.bucket,
                    Delete: { Objects: [] }
                };

                for(var i = 0; i < data.Contents.length; i++)
                    if(pushedKeys.indexOf(data.Contents[i].Key) < 0)
                        if(!data.Contents[i].Key.startsWith(path.join(flags.target.prefix, '_backup')))
                            params.Delete.Objects.push({ Key: data.Contents[i].Key });

                if(params.Delete.Objects.length > 0) {

                    console.info("Removing orphaned files...");

                    s3.deleteObjects(params, (err, data) => {
                        if(err) {
                            console.error(err);
                            return finalizePublish(false);
                        }

                        console.info("DONE");

                        finalizePublish(true);
                    });

                } else {

                    console.info("No orphaned files.\nDONE");

                    finalizePublish(true);
                }
            });
        });
    }
};
