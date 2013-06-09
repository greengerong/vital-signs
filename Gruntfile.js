module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg:grunt.file.readJSON('package.json'),
        jshint:{
            browser:{
                options:{
                    browser:true,
                    globals:{
                        jQuery:true
                    }
                },
                files:{
                    src:['asserts/**/*.js', "spec/client/**/*spec.js"]
                }
            },
            node:{
                options:{
                    browser:false,
                    globals:{
                        module:true
                    },
                    files:{
                        src:['api/**/*.js', 'config/**/*.js', "spec/node/**/*spec.js"]
                    }
                }
            }
        },
        nodeunit:{
            all:['spec/node/**/*spec.js']
        },
        karma:{
            options:{
                configFile:'karma.conf.js'
            },
            local:{
                browsers:['Chrome']
            },
            ci:{
                browsers:['PhantomJS']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-karma');

    // Default task(s).
    grunt.registerTask('default', ["jshint:browser", "jshint:node", "nodeunit", "karma:local"]);
    grunt.registerTask('ci', ["jshint:browser", "jshint:node", "nodeunit", "karma:ci"]);

};