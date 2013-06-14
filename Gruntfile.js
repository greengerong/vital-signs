module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg:grunt.file.readJSON('package.json'),
        jshint:{
            options:{
                curly:true,
                eqeqeq:true,
                eqnull:true,
                browser:true,
                '-W015':true,
                reporter:'checkstyle'
            },
            client:{
                options:{
                    browser:true,
                    reporterOutput:'checkstyle/client/report.xml',
                    globals:{
                        jQuery:true,
                        describe:true,
                        it:true,
                        expect:true,
                        angular:true,
                        $:true
                    }
                },
                files:{
                    src:['asserts/**/*.js', "plugins/**/*.js", "spec/client/**/*spec.js", "spec/client/**/*Spec.js"]
                }
            },
            node:{
                options:{
                    browser:false,
                    reporterOutput:'checkstyle/node/report.xml',
                    globals:{
                        module:true,
                        sails:true
                    },
                    files:{
                        src:['api/**/*.js', 'config/**/*.js', "plugins/**/*.job", "spec/node/**/*spc.js", "spec/node/**/*Spec.js"]
                    }
                }
            }
        },
        nodeunit:{
            all:['spec/node/**/*.js']
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
    grunt.registerTask('default', ["jshint:client", "jshint:node", "nodeunit", "karma:local"]);
    grunt.registerTask('ci', ["jshint:client", "jshint:node", "nodeunit", "karma:ci"]);

};