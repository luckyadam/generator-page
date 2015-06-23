'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var path = require('path');
var wiredep = require('wiredep');
var _ = require('underscore.string');

module.exports = yeoman.generators.Base.extend({

  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
  },

  initializing: function () {
    this.log(yosay(
      chalk.cyan('拍拍无线页面构建脚手架')
    ));
    this.log('need help? go and open issue: https://github.com/luckyadam/generator-page/issues/new');
    this.pageConf = {};
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();
    var prompts = [{
      type: 'input',
      name: 'author',
      message: '雁过留声，人过留名~~',
      default: this.user.git.name() || process.env.USER,
      store: true
    }, {
      type: 'input',
      name: 'appName',
      message: '告诉我项目名称吧~',
      store: true,
      validate: function(input) {
        if (!input) {
          return '不能为空哦，会让人家很为难的~';
        }
        return true;
      }.bind(this)
    }, {
      type: 'input',
      name: 'modName',
      message: '告诉我模块名称吧~',
      store: false,
      validate: function(input) {
        if (!input) {
          return '不能为空哦，会让人家很为难的~';
        }

        if (fs.existsSync(this.destinationPath(input))) {
          return '目录已经存在哦，如果你只想增加页面，请使用 yo page:page 页面名~';
        }
        return true;
      }.bind(this)
    }, {
      type: 'input',
      name: 'pageName',
      message: '告诉我页面名称吧~',
      store: false,
      when: function (anwsers) {
        this.folderName = anwsers.modName;
        return anwsers.modName;
      }.bind(this),
      validate: function(input) {
        if (!input) {
          return '不能为空哦，会让人家很为难的~';
        }
        return true;
      }.bind(this)
    }];
    this.prompt(prompts, function(anwsers) {
      this.pageConf = anwsers;
      this.pageConf.date = ((new Date()).getFullYear()) + '-' + ((new Date()).getMonth() + 1) + '-' + ((new Date()).getDate());
      this.pageConf.modClassName = this._.classify(this.pageConf.modName);
      this.pageConf.modName = _.decapitalize(this.pageConf.modClassName);
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      var pageConf = this.pageConf;
      this.mkdir(pageConf.modName);
      this.mkdir(pageConf.modName + '/css');
      this.mkdir(pageConf.modName + '/image');
      this.mkdir(pageConf.modName + '/js');

      this.copy('temp.html', pageConf.modName + '/' + pageConf.pageName + '.html');
      this.copy('css/temp.css', pageConf.modName + '/css/' + pageConf.pageName + '.css');
    }
  },
  end: function() {
    var talkText = 'yo yo 文件已经生成好啦~~\n';
    this.log(chalk.green(talkText) + chalk.white('You are ready to go') + '\n' + chalk.green('HAPPY CODING \\(^____^)/'));
  }
});
