module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),


        clean: {
            options: { force: true },
            "build": [ 'build/**', '.temp/**' ],
        },

        sync: {

            "html": {
                files: [{
                    cwd: 'src/',
                    dest: 'build/',
                    src: [ '*.html', 'Modules/**/templates/*.html' ]
                }]
            },

            "images": {
                files: [{
                    cwd: 'src/',
                    dest: 'build/',
                    src: 'Assets/images/**'
                }]
            },

            "json": {
                files: [{
                    cwd: 'src/',
                    dest: 'build/',
                    src: '*.json'
                }]
            },

            "scripts": {
                files: [{
                    cwd: 'src/',
                    dest: 'build/',
                    src: 'scripts/**'
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


        }

    });

    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-curl');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('build', [
        'clean:build',
        'uglify:devel',
        'sass:build',
        'cssmin:devel',
        'sync:html',
        'sync:images',
        'sync:json',
        'sync:scripts'
    ]);

    grunt.registerTask('build-release', [
        'clean:build',
        'uglify:release',
        'sass:build',
        'cssmin:release',
        'sync:html',
        'sync:images',
        'sync:json'
    ]);
};
