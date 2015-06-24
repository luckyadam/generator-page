'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var path = require('path');
var wiredep = require('wiredep');
var _ = require('underscore.string');

module.exports = yeoman.generators.Base.extend({
  _getExistFileResult: function (name) {
    var isExistFile = false;
    var file;
    if (name && name.length > 0) {
      file = this.expand(this.destinationPath(name + '.html'));
      if (file.length > 0) {
        isExistFile = true;
      }
    }
    return isExistFile;
  },
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
  },

  initializing: function () {
    this.argument('pageName', {
      required: true,
      type: String,
      desc: 'page name'
    });
    this.log(yosay(
      chalk.cyan('拍拍无线页面构建脚手架')
    ));
    this.log('need help? go and open issue: https://github.com/luckyadam/generator-page/issues/new');
    this.pageConf = {};
    this.pkg = require('../package.json');
    var pwd = this.destinationPath();
    this.forlderName = pwd.substr(pwd.lastIndexOf('/') + 1);
    this.isExistFile = this._getExistFileResult(this.pageName);
  },

  prompting: function () {
    var done = this.async();
    var prompts = [];
    if (this.isExistFile) {
      prompts.push({
        type: 'input',
        name: 'pageName',
        message: '页面已经存在当前目录中了，换个名字吧~',
        store: true,
        validate: function(input) {
          if (!input) {
            return '不能为空哦，会让人家很为难的~';
          }
          return true;
        }.bind(this)
      });
    }
    prompts.push({
      type: 'input',
      name: 'author',
      message: '雁过留声，人过留名~~',
      default: this.user.git.name() || process.env.USER,
      store: true
    });
    prompts.push({
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
    })
    this.prompt(prompts, function(anwsers) {
      this.pageConf = anwsers;
      this.pageConf.date = ((new Date()).getFullYear()) + '-' + ((new Date()).getMonth() + 1) + '-' + ((new Date()).getDate());
      this.pageConf.modName = this.forlderName;
      this.pageConf.modClassName = this._.classify(this.pageConf.modName);
      this.pageConf.modName = _.decapitalize(this.pageConf.modClassName);
      this.pageConf.pageName = this.pageConf.pageName || this.pageName;
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      var pageConf = this.pageConf;
      this.copy('temp.html', pageConf.pageName + '.html');
      this.copy('temp.css', 'css/' + pageConf.pageName + '.css');
    }
  },
  end: function() {
    var talkText = 'yo yo 文件已经生成好啦~~\n';
    this.log(chalk.green(talkText) + chalk.white('You are ready to go') + '\n' + chalk.green('HAPPY CODING \\(^____^)/'));
  }
});
