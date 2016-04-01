<<<<<<< HEAD
// Ionic CLI is no longer responsible for building your web assets, and now
// relies on gulp hooks instead. This file was used for exposing web build
// configuration and is no longer necessary.
// If this file is executed when running ionic commands, then an update to the
// CLI is needed.
//
// If your version of the Ionic CLI is beta.21 or greater, you can delete this file.
console.log('\nFrom ionic.config.js:');
console.log('\nPlease update your version of the Ionic CLI:');
console.log('    npm install -g ionic@beta\n');
process.exit(1);
=======
module.exports = {
  name: 'ionic-conference-app',
  proxies: null,

  paths: {
    html : {
      src: ['app/**/*.html'],
      dest: "www/build"
    },
    sass: {
      src: ['app/theme/app.+(ios|md).scss'],
      dest: 'www/build/css',
      include: [
        'node_modules/ionic-framework',
        'node_modules/ionicons/dist/scss'
      ]
    },
    fonts: {
      src: ['node_modules/ionic-framework/fonts/**/*.+(ttf|woff|woff2)'],
      dest: "www/build/fonts"
    },
    watch: {
      sass: ['app/**/*.scss'],
      html: ['app/**/*.html'],
      livereload: [
        'www/build/**/*.html',
        'www/build/**/*.js',
        'www/build/**/*.css'
      ]
    }
  },

  autoPrefixerOptions: {
    browsers: [
      'last 2 versions',
      'iOS >= 7',
      'Android >= 4',
      'Explorer >= 10',
      'ExplorerMobile >= 11'
    ],
    cascade: false
  },

  // hooks execute before or after all project-related Ionic commands
  // (so not for start, docs, but serve, run, etc.) and take in the arguments
  // passed to the command as a parameter
  //
  // The format is 'before' or 'after' + commandName (uppercased)
  // ex: beforeServe, afterRun, beforePrepare, etc.
  hooks: {
    beforeServe: function(argv) {
      //console.log('beforeServe');
    }
  }
};
>>>>>>> ac1d1f05994b9d39c72b6744ba288c3d63288aef
