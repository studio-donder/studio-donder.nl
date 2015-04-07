module.exports = function (grunt) {
    var mozJpeg = require('imagemin-mozjpeg');

    grunt.initConfig({
        vars: {
            favicons: {
                src: 'temp/images/favicon.png',
                dest: 'build/images/favicons'
            }
        },
        pkg: grunt.file.readJSON('package.json'),

        bower: {
            install: {}
        },

        clean: {
            generatedResources: ['build', 'temp']
        },

        copy: {
            fontAwesomeFonts: {
                expand: true,
                flatten: true,
                cwd: 'bower_components/font-awesome/fonts',
                src: [
                    'fontawesome-webfont.eot',
                    'fontawesome-webfont.svg',
                    'fontawesome-webfont.ttf',
                    'fontawesome-webfont.woff',
                    'fontawesome-webfont.woff2'
                ],
                dest: 'build/fonts',
                filter: 'isFile'
            },
            iCheckMoviesFonts: {
                expand: true,
                flatten: true,
                cwd: 'lib/icheckmovies-icon-font',
                src: [
                    'iCheckMovies.eot',
                    'iCheckMovies.svg',
                    'iCheckMovies.ttf',
                    'iCheckMovies.woff'
                ],
                dest: 'build/fonts',
                filter: 'isFile'
            }
        },

        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            lint: {
                options: {
                    import: 2
                },
                src: ['build/css/main.css']
            }
        },

        cssmin: {
            options: {
                rebase: false
            },
            minify: {
                src: 'build/css/main.css',
                dest: 'build/css/main.min.css'
            }
        },

        image_resize: {
            avatar: {
                options: {
                    height: 360,
                    width: 360
                },
                files: {
                    'temp/images/avatar.png': 'temp/images/avatar.png'
                }
            }
        },

        imagemin: {
            build: {
                options: {
                    optimizationLevel: 6,
                    use: [mozJpeg()]
                },
                files: [
                    {
                        expand: true,
                        cwd: 'temp/images',
                        src: [
                            '**/*.{jpg,png,gif}',
                            '!favicon/*.*'
                        ],
                        dest: 'build/images'
                    }
                ]
            }
        },

        less: {
            compile: {
                options: {
                    paths: ['src/less'],
                    cleancss: false
                },
                files: {
                    'build/css/main.css': 'src/less/main.less'
                }
            }
        },

        mkdir: {
            favicons: {
                options: {
                    create: ['build/images/favicons']
                }
            }
        },

        shell: {
            generateFavicons: {
                options: {
                    stdin: false
                },
                command: [
                    'convert <%= vars.favicons.src %> -resize 16x16 <%= vars.favicons.dest %>/16x16.png',
                    'convert <%= vars.favicons.src %> -resize 32x32 <%= vars.favicons.dest %>/32x32.png',
                    'convert <%= vars.favicons.src %> -resize 48x48 <%= vars.favicons.dest %>/48x48.png',
                    'convert <%= vars.favicons.dest %>/16x16.png <%= vars.favicons.dest %>/32x32.png <%= vars.favicons.dest %>/48x48.png -alpha on -background none  <%= vars.favicons.dest %>/favicon.ico',
                    'convert <%= vars.favicons.src %> -resize 64x64 <%= vars.favicons.dest %>/favicon.png'
                ].join('&&')
            }
        },

        svg2png: {
            avatar: {
                files: [{
                    src: ['src/images/avatar.svg'],
                    dest: 'temp/images'
                }]
            },
            backdrop: {
                files: [{
                    src: ['src/images/backdrop.svg'],
                    dest: 'temp/images'
                }]
            },
            favicon: {
                files: [{
                    src: ['src/images/favicon.svg'],
                    dest: 'temp/images'
                }]
            }
        },

        watch: {
            styles: {
                files: ['src/less/**/*.less'],
                tasks: ['buildStyles']
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-image-resize');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-svg-to-png');

    grunt.registerTask('default', [
        'clean:generatedResources',
        'bower:install',
        'buildImages',
        'buildStyles',
        'copy:fontAwesomeFonts',
        'copy:iCheckMoviesFonts'
    ]);

    grunt.registerTask('buildImages', [
        'generateFavicons',
        'svg2png:avatar',
        'svg2png:backdrop',
        'image_resize:avatar',
        'imagemin:build'
    ]);

    grunt.registerTask('buildStyles', [
        'less:compile',
        'csslint:lint',
        'cssmin:minify'
    ]);

    grunt.registerTask('generateFavicons', [
        'mkdir:favicons',
        'svg2png:favicon',
        'shell:generateFavicons'
    ]);
};
