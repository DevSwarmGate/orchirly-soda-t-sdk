"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
      }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
        var n = t[o][1][e];return s(n ? n : e);
      }, f, f.exports, e, t, n, r);
    }return n[o].exports;
  }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
    s(r[o]);
  }return s;
})({ 1: [function (require, module, exports) {
    var _getAPIURL = require('./_getAPIURL'),
        _make_api2 = require('./_make_api'),
        _request = require('./_request');

    var APIAbstract = function () {
      function APIAbstract(API_host, token, model_json) {
        _classCallCheck(this, APIAbstract);

        this._isApiresult = true;
        this._token = token;
        this._debug = false;
        this._api_host = API_host;
        this._modelName = null;
        this._verbs = {};

        this._make_api(model_json);
      }
      /*-----------------
      * getter and setter
      ------------------*/


      _createClass(APIAbstract, [{
        key: "request",

        /*------------
        * public method
        -------------*/
        value: function request(verb, options, cb) {
          _request.call(this, verb, options, cb);
        }
      }, {
        key: "getAPIURL",
        value: function getAPIURL(verb, options) {
          return _getAPIURL.call(this, verb, options);
        }
        /*------------
        * private method
        -------------*/

      }, {
        key: "_make_api",
        value: function _make_api(json) {
          _make_api2.call(this, json);
        }
      }, {
        key: "debug",
        set: function set(bool) {
          this._debug = bool;
        }
      }, {
        key: "modelName",
        get: function get() {
          return this._modelName;
        }
      }, {
        key: "verbs",
        get: function get() {
          return this._verbs;
        }
      }]);

      return APIAbstract;
    }();

    module.exports = APIAbstract;
  }, { "./_getAPIURL": 2, "./_make_api": 3, "./_request": 4 }], 2: [function (require, module, exports) {
    function _getAPIURL(verb, options) {
      var _this = this;

      if (!options.get) options.get = {};

      var parseParam = function parseParam(data) {
        var res = '',
            keys = _this._verbs[verb].get;

        for (var i = 0; i < keys.length; i++) {
          if (data[keys[i]]) {

            res += keys[i] //encodeURIComponent(keys[i])
            + "=" + data[keys[i]] //encodeURIComponent(data[keys[i]])
            + "&";
          } else if (_this._debug) {
            console.log(_this._modelName + "/" + verb, "missing a GET param:" + _this._verbs[verb].post[i]);
          }
        }

        res = res.substring(0, res.length - 1);

        // if(keys.length !== 0)
        //     res = '?'+res;

        return res;
      };

      return this._isApiresult ? this._api_host + "/index.php?g=Wap&m=Apiresult&a=index&mname=" + this._modelName + "&aname=" + verb + "&token=" + this._token + "&" + parseParam(options.get, 'GET') : this._api_host + "/index.php?g=Wap&m=Index&a=" + verb + "&token=" + this._token + "&" + parseParam(options.get, 'GET');
    }

    module.exports = _getAPIURL;
  }, {}], 3: [function (require, module, exports) {
    var VERB_STRUCT = {
      "get": [],
      "post": []
    };

    function _make_api(json) {
      var verbs = [];

      var makeVerb = function makeVerb(verbObj) {
        var struct = Object.assign({}, VERB_STRUCT);
        struct.get = verbObj.get;
        struct.post = verbObj.post;
        return struct;
      };

      if (json.constructor === "".constructor) json = JSON.parse(json);

      for (var i in json.verbs) {
        verbs[i] = makeVerb(json.verbs[i]);
      }

      this._modelName = json.modelName;
      this._verbs = verbs;
      this._isApiresult = json.isApi ? json.isApi : true;
    };

    module.exports = _make_api;
  }, {}], 4: [function (require, module, exports) {
    function _request(verb, options, cb) {
      var _this2 = this;

      var xhr = new XMLHttpRequest();

      var parseParam = function parseParam(data, method) {
        var res = '',
            keys = method === "GET" ? _this2._verbs[verb].get : _this2._verbs[verb].post;

        for (var i = 0; i < keys.length; i++) {
          if (keys[i] && keys[i] in data) {

            res += encodeURIComponent(keys[i]) + "=" + encodeURIComponent(data[keys[i]]) + "&";
          } else if (_this2._debug) {
            console.log(_this2._modelName + "/" + verb, "missing a " + method + " param:" + _this2._verbs[verb].post[i]);
          }
        }

        res = res.substring(0, res.length - 1);

        // if(method === "GET" && keys.length !== 0)
        //     res = '?'+res;

        return res;
      };

      xhr.open(this._verbs[verb].post.length === 0 ? "GET" : "POST", this._isApiresult ? this._api_host + "/index.php?g=Wap&m=Apiresult&a=index&mname=" + this._modelName + "&aname=" + verb + "&token=" + this._token + "&" + parseParam(options.get, 'GET') : this._api_host + "/index.php?g=Wap&m=Index&a=" + verb + "&token=" + this._token + "&" + parseParam(options.get, 'GET'));

      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

      xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
          var responseData = JSON.parse(xhr.responseText);

          if (this._debug) {
            console.log(this._modelName + "/" + verb + ":", responseData);
          }

          if (cb !== undefined) {
            cb(responseData);
          }
        }
      };

      xhr.send(parseParam(options.post, 'POST'));

      if (this._debug) console.log("API requested url:", this._isApiresult ? this._api_host + "/index.php?g=Wap&m=Apiresult&a=index&mname=" + this._modelName + "&aname=" + verb + "&token=" + this._token + "&" + parseParam(options.get, 'GET') : this._api_host + "/index.php?g=Wap&m=Index&a=" + verb + "&token=" + this._token + "&" + parseParam(options.get, 'GET'));
    };

    module.exports = _request;
  }, {}], 5: [function (require, module, exports) {
    var Util = require('../Util/Util'),
        _appendIcon = require('./_appendIcon'),
        _convert = require('./_convert'),
        _drawCanvas2 = require('./_drawCanvas'),
        _init2 = require('./_init'),
        _init_eleStyle2 = require('./_init_eleStyle'),
        _loadImg2 = require('./_loadImg'),
        _setEle2 = require('./_setEle'),
        _handle_icon_select2 = require('./_handle_icon_select');

    var LOGO_SRC = require('./_logoImg_base64'),
        BG_SRC = require('./_bgImg_base64'),
        LOADING_SRC = require('./_loadingGif_base64');

    var SIZE_RATIO = 693 / 868,
        RATIO = 2;

    var ELE_STYLE = {
      'position': 'absolute',
      'background-position': '0% 0%',
      'background-size': '100% 100%',
      'background-repeat': 'no-repeat',
      'display': 'none'
    };

    var Canvas_Item = function () {
      function Canvas_Item(container, option) {
        _classCallCheck(this, Canvas_Item);

        this._container = container;
        this._bg_container = document.createElement('div');
        this._icon_container = document.createElement('div');

        this._ratio = RATIO;
        this._size_ratio = SIZE_RATIO;
        this._ele_style = ELE_STYLE;

        this._bg_ele = document.createElement('div');
        this._bottomLogo_ele = document.createElement('div');
        //this._sodaLogo_ele = document.createElement('div');
        this._frame_ele = document.createElement('div');
        this._shirt_ele = document.createElement('div');
        this._icons = [];
        this._icon_imgs = [];

        this._bg_img = null;
        this._bottomLog_img = null;
        //this._sodaLogo_img = null;
        this._frame_img = null;
        this._shirt_img = null;

        this._bg_src = BG_SRC;
        this._bottomLogo_src = LOGO_SRC;
        //this._sodaLogo_src = SODA_SRC;
        this._loadingGif_src = LOADING_SRC;

        this._deleteCb = function () {
          console.log('icon delete cb');
        };

        this._canvas = document.createElement('canvas');
        this._init_option(option);
        this._init();
      }
      /*-------------------
          getter and setter
      --------------------*/


      _createClass(Canvas_Item, [{
        key: "appendIcon",

        /*-------------------
            public method
        --------------------*/
        value: function appendIcon(src, option) {
          _appendIcon.call(this, src, option);
        }
      }, {
        key: "convert",
        value: function convert(cb) {
          return _convert.call(this, cb);
        }
        /*-------------------
            private method
        --------------------*/

      }, {
        key: "_drawCanvas",
        value: function _drawCanvas(cb) {
          _drawCanvas2.call(this, cb);
        }
      }, {
        key: "_setEle",
        value: function _setEle(eleKey, src) {
          _setEle2.call(this, eleKey, src);
        }
      }, {
        key: "_init_option",
        value: function _init_option(option) {
          Util.init_option.call(this, option);
        }
      }, {
        key: "_init_eleStyle",
        value: function _init_eleStyle(ele, style) {
          _init_eleStyle2.call(this, ele, style);
        }
      }, {
        key: "_init",
        value: function _init() {
          _init2.call(this);
        }
      }, {
        key: "_loadImg",
        value: function _loadImg(src, cb) {
          _loadImg2.call(this, src, cb);
        }
      }, {
        key: "_handle_icon_select",
        value: function _handle_icon_select(icon) {
          _handle_icon_select2.call(this, icon);
        }
      }, {
        key: "shirt",
        get: function get() {
          return this._shirt_ele;
        },
        set: function set(src) {
          this._setEle('shirt', src);
        }
      }, {
        key: "frame",
        get: function get() {
          return this._frame_ele;
        },
        set: function set(src) {
          this._setEle('frame', src);
        }
      }, {
        key: "onIconDelete",
        set: function set(cb) {
          this._deleteCb = cb;
        }
      }]);

      return Canvas_Item;
    }();

    module.exports = Canvas_Item;
  }, { "../Util/Util": 43, "./_appendIcon": 6, "./_bgImg_base64": 7, "./_convert": 8, "./_drawCanvas": 9, "./_handle_icon_select": 10, "./_init": 11, "./_init_eleStyle": 12, "./_loadImg": 13, "./_loadingGif_base64": 14, "./_logoImg_base64": 15, "./_setEle": 16 }], 6: [function (require, module, exports) {
    var Icon = require('../Icon_Item/Icon_Item');

    function _appendIcon(src, option) {
      var icon = new Icon(src, this._icon_container, option);

      this._icons.push(icon);

      icon._dom.style.left = '42.5%';
      icon._dom.style.top = '45%';
      icon.touchCb = this._handle_icon_select.bind(this);
      icon.deleteCb = this._deleteCb.bind(this);
    };

    module.exports = _appendIcon;
  }, { "../Icon_Item/Icon_Item": 17 }], 7: [function (require, module, exports) {
    module.exports = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAArUAAANkCAMAAACeayJNAAAB71BMVEX///8AAADr6+v5+fnf3t7U09P////Kycn19fXg39/NzMz////9/f0EAAAEAAD///8GAwMIBQX39/fz8/P////7+/sEAAD8/PwLCAj////l5eUEAAAEAAD////v7+/x8fH////n5+cEAAD////t7e3i4uL////Y19cFAQH+/v4EAAD////Hxsb////////6+vrc29vR0ND///8FAgIEAADa2dn///////8VEhL///8GAwMEAAD+/v7////////////8/PwRDQ3////////q6urp6enPzs7///+Jh4f///////////////8EAAD////////////////////////W1dX////////////////////////////////////e3d3///////+6uLi1tLT///92c3P////////T0tL////////////BwMD///+joqL///8EAADJyMj////////////////W1NTDwsL+/v6/vr7///+vra2WlJT///88OTn////09PT////HxcXu7u7NzMzZ2dnPz8/q6uq4traamJhubGzNzMxST0+vra1kYWEYFRXQz8/f39/V1NS3tra0srLIx8erqanMzMyZl5fh4eHr6+vQ0NCvrq6ko6Pm5ubp6enR0ND29vbl5OT6+vrZ2dnY2NiSIX02AAAApXRSTlPUANTU1NQ+1NTU1HrUAi0CCwfU1AHUA9QWBNQpEgbU1H7UJRrU1EzUGwofFshzI9TU1FYQBNSOahoQDgWSZltDMi8qDNTU1IJfRjguJyIfDYZ3YQ7U0MObim1RSDsD1MquopddUhMS1M29ubChejUUzsGzpQjIuaqklo1mQDoFyMa/tLSem5ltUE1IQD8zHsnInZuPiIVvbl5TUiIdycO8uaqHhoVHoBd2AAAQvklEQVR42uzc62vTUBjH8VMnpdCU03Zn1ojZMqLBElIhSmu1SUsrlF7oFe0dC6VljlHRDWQgUwR9IQr6RsTLC/Ef9dSKbE7rBN1O4Pf5G748PE+SlngWoXJ0Uil5davRMet+9Ts/wD9Ur5tmJ2E3Rk5XL/QzZS0ZlSnzLLCgWkaVqlbu607CVPO1Wnt3a7h5/8kGAfjHNm7fHW7F/XbDsbp6uliKGVVlUbdkQbNNrZS2bFOtteNbD24TgP/r1mZLHc267WdiWpN3+7fVzprNFEYdtRZPPbxPAI7HxjBv6b0/zFvym302p5UKIzPPp+xdAnCcbm11emnvNFsxcjJlR62W0Z1x+ZHDm00N7xCAY7fpL3iLs7tMGbCjVUvlamXaTai8WZxecELu13m283F7lGqpMi6nG/Va6iHmLJygu/Y0k51fZX+qlg2iWqbbycdbeGgAJ2y7UOLZJncGbHG1jG8HfcespR4QgJO2YWbLMW0SlemiapmcjKUb/jYGLYhhexqraGOe7e+rpXvJcsFW49u3CIAQnugV7dC0JQfusEm2l8jHsR2AQBKGYSR5tr+ulu0lszq/w/BaAYRSM8bjg9mSfTvtPFqstCCY3XEzWd2R6eFqmdws8/UghWhBOK1kNJdTBuxQtYNqjB9imLQgolZUiUYVyn6qlkYr3obaxtddIKQUpYoiU3agWqoYRade2yQAQvIHPLIyoPurZfKk1DXzQwIgJskJBAYyZfuqpblYL6G2CICgpKXMmQAdUPajWqpo3oY/jjdiIK7I449XA5TSH9XKk4xlqrjEQGDSUio0y5bNqp3vBwXbv00ABLYSfsezZd+rZXtG0THb2A9AaFL48YfQGZ7tt2pptawn6vj6AMQmXfY9D4YCnm/VMkXrj8xdAiC2SHjtxTxbwkdtlo9a/EYMRCctLT+9HrwamM3aPaPvdPCoFsS34lt9HwzNqqW5sm6bGLUgPim89vRK8EbAQ2RjaiWw1YILSJeXL7y/zp8jkJ1KupHA94ngBhHf6ufzfEcgzVLXrhEAF5DCqzdfXgmdIUbRsvGtF7gCXxFOfeHDlsQKTgKvxcAdIr4Ln85eCZGSPooTAFfgK8L6i/NBUuyO8P8H4BLS0tr6s7PXiddqYEEAt1hZvvn62nmStlQC4BIR36mLL++RnoW3ueAaUvjCubdnebX4YS64Bj/Hzr25RnQLay24x+XVc68vEd0mAK6xsrZ++hXRcYyBi0SW17+yb/cmEQRQGEUf+4cDE63tCCZroC1obmJqtpmIFmBuq45lXDinhhs8eHyH73m+G8hYbx8OX/P4NpCx3lyWn7n3GSNkPV+Wz7ka5xKynnfLx5yMbyjZqv2dl4GQrdr3eRoI2f9XexoI2ap9netAyFbtUbW07HeHowuBFtXSo1p6VEuPaulRLT2qpUe19KiWHtXSo1p6VEuPaulRLT2qpUe19KiWHtXSo1p6VEuPaulRLT2qpUe19KiWHtXSo1p6VEuPaulRLT2qpUe19KiWHtXS88cuHZAAAAAACPr/uh2BbtBafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOUndumABAAAAEDQ/9ftCHSD1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP7FLByQAAAAAgv6/bkegG7SWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mJXTogAQAAABD0/3U7At2gtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLT+zSAQkAAACAoP+v2xHoBq3lx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn6s5cdafqzlx1p+rOXHWn5ilw5IAAAAAAT9f92OQDdoLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byYy0/1vJjLT/W8mMtP9byE7t0QAIAAAAg6P/rdgS6QWv5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlh9r+bGWH2v5sZYfa/mxlp/YpQMSAAAAAEH/X7cj0A1ay4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X8WMuPtfxYy4+1/FjLj7X81L69tigRxXEcP+uFM9px1JlcbcZGZnMasyGVEmqLamsVKSoiH8bGLtuFxFroSkt0v9/oXhQR0QvtHLNOIOSTrZ0Dv89r+PLn51FRLagH1YJ6UC2oB9WCelAtqAfVgnpQLagH1YJ6UC2oB9WCelAtqAfVgnpQLagH1YJ6UC2oB9WCelAtqAfVgnpQLagH1YJ6UC2oB9WCelAtqAfVgnoG1R4nAAoxZudOk3MEQCHGbL1B9hIAdTCjVX9BDhIAdTDDbb4g+24SAGUwzWreIvvOEgBlMNPye2TLFQKgjHzJ614lW3YRAGXkHC/+mhxeQwCUUSvHGn2yYTcBUEY0Um93yIYDBEAVTHP95BOyecMZAqAIZnrxwCabT10gAIrIOYnGvE1OHjtKANTAopFmsm+THUf2EAA1MM3q0kWbHNu//wQBUEK+5DWCmSmyf9M6fM8AahgMhAW9Si5uSm8kACrgAyFOO3aFrF+f3oSJAErgLwhJPhAKJL0+nfrGCEDoMaPl02v6oSJZuy6d2ptDthB++ZLXpo/syjSZSKdT264gWwg9ZkR8elWfKmTIxFpe7UcD2ULY5U1+ajt6detOMjGxNjWZ/WrkkS2E2uDUXp6xt2dSvNoJXu1HLYpsIcxYrpQQp/ZQMcur5VLZzG0typAthBfT3C7t6XYlMznxs9pt2cemVkO2EFosWq5Tujg4tcNqJ7OZ+6aRQ7YQUixneg26oPNVO/mr2tTOzKcbJTwkQFgxrdWlwXW9Kk6tqHZ4bD84Jh4SIJyYIfbBsnir5dGKaofHdvp+GdlCKLGak0jSV7pemd4pqx0c289fyibevyB8+Ki1GvTW9Z8fxWS14thufdpCthA+Ito4XVoU+2BSVjvINpspvnORLYQNy4mXWvpePNWKfSCrHWyE6eJ3N4JtC6HCo235lL7V+Q8Q+D74Xa3cCIW7VqSEbCE8htEu6MNRK6uVG2H7XauFd1sIDb5pXR7t/IwctbLaP7L1XEdDthAKrFayuiPRDquV0/b89peehc9kEAYsbzjeaT4PBtFuG0Yrq5XZFipvYt4sVgKsOj5pI7G2+CAmox2tdpDt1kLlQT3Bzy1+uQiribFoyW1SuvR+JFpR7Wi2Dy/VvZaD34DB6uGHtpzg6+DWIn89kNHKakdHwrN7zTkvgpkAq4TlDMfyk5S+uq7r1aL8IDZSrfxFwvlK9cElP8bfbnFv4f/jzZbcOl+0wbKu25Vilkf7l2rlA1j12dW4P8e7xV8c4L9irKY57lyDUrrAD+3U9ulsikf7t2rlt2TPDz28E/frnlvGnxzgf2H8zJplqy6a7fFFa1fPD357MLZauRKmlu804s2YNeuYRi2PcuGfYixf48m6Cb/Nm73c0cWh3SrXwZhq5bm1l3ttEa7nRhxTM6I53i7qhRXFuHyuZmimM2sl/AblrnZmeLOVIj+0PNrx1cpzK9btlP3o9VKyfbrL3xQsdzZSdkqmoAGsBFMoOeVIy/JizXibcsG1R7oYB4WMXLRjqpXndtuw25nOQkBpsnE67jfr9blYAmDlxGJz9abfjTeSVAgWxJnVp6qFaTkOxlQ72q3YCfbMYn8+oANJgBVFfwvm+4siWftQ5XyGN8ujHVvtqJTYCfy7Mn5wbV1/0ulfm+9dDoIlCrBiloLgcm/+Wr/zRBdsfmaLotm/hPkDql4IlkYOQo0AAAAASUVORK5CYII=';
  }, {}], 8: [function (require, module, exports) {
    function _convert(cb) {
      var _this3 = this;

      var containerClientRect = this._container.getBoundingClientRect();

      console.log(containerClientRect);
      this._canvas.width = containerClientRect.width * this._ratio;
      this._canvas.height = containerClientRect.height * this._ratio;
      this._canvas.style.width = '100%';

      var check = function check() {
        if (_this3._icons.length !== _this3._icon_imgs.length) return;

        _this3._drawCanvas(function () {
          cb(_this3._canvas.toDataURL());
          _this3._icon_imgs = [];
        });
      };

      this._icons.forEach(function (icon) {
        var img = new Image();

        img.onload = function () {
          _this3._icon_imgs.push(img);
          check();
        };
        img.src = icon.convert();
      });
    };

    module.exports = _convert;
  }, {}], 9: [function (require, module, exports) {
    function _drawCanvas(cb) {
      var _this4 = this;

      var list = [this._bg_img, this._bottomLogo_img, this._shirt_img, this._frame_img],
          ctx = this._canvas.getContext("2d"),
          width = 0.9 * this._bg_img.width * this._ratio,
          height = 0.9 * this._bg_img.height * this._ratio;

      var draw = function draw(img, isLast) {
        ctx.drawImage(img, 0, 0, width, height);

        if (isLast) cb();
      };

      list.forEach(function (img) {
        requestAnimationFrame(function () {
          draw(img);
        });
      });

      this._icon_imgs.forEach(function (img, index) {
        var isLast = false;

        if (index === _this4._icon_imgs.length - 1) isLast = true;

        requestAnimationFrame(function () {
          draw(img, isLast);
        });
      });
    };

    module.exports = _drawCanvas;
  }, {}], 10: [function (require, module, exports) {
    function _handle_icon_select(now_icon) {
      this._icons.forEach(function (icon) {
        if (icon !== now_icon && icon.active) icon.active = false;
      });
    };

    module.exports = _handle_icon_select;
  }, {}], 11: [function (require, module, exports) {
    function _init() {
      var _this5 = this;

      var eles = [];

      var check = function check() {
        if (eles.length < 2) return;

        _this5._bg_container.appendChild(_this5._bg_ele);
        _this5._bg_container.appendChild(_this5._bottomLogo_ele);
        //this._bg_container.appendChild(this._sodaLogo_ele);
        _this5._bg_container.appendChild(_this5._shirt_ele);
        _this5._bg_container.appendChild(_this5._frame_ele);

        _this5._init_eleStyle(_this5._shirt_ele, _this5._ele_style);
        _this5._init_eleStyle(_this5._frame_ele, _this5._ele_style);
      };

      this._container.style.left = 0.05 * window.innerWidth + 'px';
      this._container.style.width = this._bg_container.style.width = this._icon_container.style.width = 0.9 * window.innerWidth + 'px';
      this._container.style.height = this._bg_container.style.height = this._icon_container.style.height = 0.9 * window.innerWidth / this._size_ratio + 'px';
      this._container.appendChild(this._bg_container);
      this._container.appendChild(this._icon_container);
      this._init_eleStyle(this._bg_container, this._ele_style);
      this._init_eleStyle(this._icon_container, this._ele_style);
      this._bg_container.style.display = '';
      this._icon_container.style.display = '';
      this._icon_container.style.overflow = 'hidden';

      this._loadImg(this._bg_src, function (img) {
        _this5._bg_img = img;
        _this5._init_eleStyle(_this5._bg_ele, _this5._ele_style);
        _this5._bg_ele.style['background-image'] = "url(" + _this5._bg_src + ")";
        _this5._bg_ele.style.display = '';
        _this5._bg_ele.style.width = _this5._frame_ele.style.width = _this5._shirt_ele.style.width = 0.9 * img.width + 'px';
        _this5._bg_ele.style.height = _this5._frame_ele.style.height = _this5._shirt_ele.style.height = 0.9 * img.height + 'px';

        eles.push(_this5._bg_ele);
        check();
      });

      // this._loadImg(this._sodaLogo_src,(img)=>{
      //     this._sodaLogo_img = img;
      //     this._init_eleStyle(this._sodaLogo_ele,this._ele_style);
      //     this._sodaLogo_ele.style['background-image'] = `url(${this._sodaLogo_src})`;
      //     this._sodaLogo_ele.style.width = img.width;
      //     this._sodaLogo_ele.style.height = img.height;

      //     eles.push(this._sodaLogo_ele);
      //     check();
      // });

      this._loadImg(this._bottomLogo_src, function (img) {
        _this5._bottomLogo_img = img;
        _this5._init_eleStyle(_this5._bottomLogo_ele, _this5._ele_style);
        _this5._bottomLogo_ele.style['background-image'] = "url(" + _this5._bottomLogo_src + ")";
        _this5._bottomLogo_ele.style.display = '';
        _this5._bottomLogo_ele.style.width = 0.9 * img.width + 'px';
        _this5._bottomLogo_ele.style.height = 0.9 * img.height + 'px';

        eles.push(_this5._bottomLogo_ele);
        check();
      });
    };

    module.exports = _init;
  }, {}], 12: [function (require, module, exports) {
    function _init_eleStyle(ele, style) {
      for (var key in style) {
        ele.style[key] = style[key];
      }
    };

    module.exports = _init_eleStyle;
  }, {}], 13: [function (require, module, exports) {
    function _loadImg(src, cb) {
      var _this6 = this;

      var img = new Image(window.innerWidth, window.innerWidth / this._size_ratio);

      img.onload = function () {
        cb.call(_this6, img);
      };

      img.src = src;
    };

    module.exports = _loadImg;
  }, {}], 14: [function (require, module, exports) {
    module.exports = 'data:image/gif;base64,R0lGODlhWAJYAqIFALu7u93d3czMzO7u7qqqqv///wAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkNEMDI3NDg4ODY1ODExRTRBQzBEQUNFNjk3M0MxNUUxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE0NTFEMDEyODY1RjExRTRBQzBEQUNFNjk3M0MxNUUxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0QwMjc0ODY4NjU4MTFFNEFDMERBQ0U2OTczQzE1RTEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0QwMjc0ODc4NjU4MTFFNEFDMERBQ0U2OTczQzE1RTEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQ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';
  }, {}], 15: [function (require, module, exports) {
    module.exports = 'data:image/png;base64,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';
  }, {}], 16: [function (require, module, exports) {
    function _setEle(eleKey, src) {
      var _this7 = this;

      if (eleKey.indexOf('_') !== 0) eleKey = "_" + eleKey;

      this[eleKey + "_ele"].style['background-image'] = this._loadingGif_src;

      this._loadImg(src, function (img) {
        _this7[eleKey + "_ele"].style['background-image'] = "url(" + src + ")";
        _this7[eleKey + "_ele"].style.display = '';
        _this7[eleKey + "_img"] = img;
      });
    };

    module.exports = _setEle;
  }, {}], 17: [function (require, module, exports) {
    var Util = require('../Util/Util'),
        _active2 = require('./_active'),
        _deactive2 = require('./_deactive'),
        _convert = require('./_convert'),
        _delete2 = require('./_delete'),
        _init3 = require('./_init'),
        _init_style2 = require('./_init_style'),
        _init_event2 = require('./_init_event'),
        _init_btn2 = require('./_init_btn'),
        _handle_touchEnd2 = require('./_handle_touchEnd'),
        _handle_touchMove2 = require('./_handle_touchMove'),
        _move2 = require('./_move'),
        _scale2 = require('./_scale'),
        _rotate2 = require('./_rotate'),
        _drawCanvas3 = require('./_drawCanvas');

    var ICON_STYLE = {
      'position': 'absolute',
      'width': 50,
      'height': 50,
      'background-position': '0% 0%',
      'background-size': '100% 100%',
      'background-repeat': 'no-repeat'
      //'background-color':'rgba(1,0,0,0.7)'
    };

    var BTN_STYLE = {
      'position': 'absolute',
      'width': 20,
      'height': 20,
      'background-position': '0% 0%',
      'background-size': '100% 100%',
      'background-repeat': 'no-repeat',
      //'background-color':'rgba(1,0,0,0.7)',
      'display': 'none'
    };

    var MAX_SIZE = 200,
        RATIO = 2;

    var Icon_Item = function () {
      function Icon_Item(imgSrc, container, option) {
        _classCallCheck(this, Icon_Item);

        this._container = container;
        this._iconStyle = ICON_STYLE;
        this._btnStyle = BTN_STYLE;
        this._imgSrc = imgSrc;
        this._imgEle = null;

        this._canvas = document.createElement('canvas');
        this._dom = document.createElement('div');

        this._closeBtn = document.createElement('div');
        this._scaleBtn = document.createElement('div');
        this._rotateBtn = document.createElement('div');

        this._touch_screenPos = null;
        this._isActive = false;
        this._isMove = false;

        this._rotation = 0;
        this._size = [this._iconStyle.width, this._iconStyle.height];
        this._maxSize = MAX_SIZE;
        this._ratio = RATIO;

        this._touchCb = function () {
          console.log('touch cb');
        };
        this._moveCb = function () {
          console.log('move cb');
        };
        this._scaleCb = function () {
          console.log('scale cb');
        };
        this._rotateCb = function () {
          console.log('rotate cb');
        };
        this._deleteCb = function () {
          console.log('delete cb');
        };

        this._init_option(option);
        this._init();
      }
      /*-------------------
          getter and setter
      --------------------*/


      _createClass(Icon_Item, [{
        key: "convert",

        /*-----------------
            public method
        ------------------*/
        value: function convert() {
          return _convert.call(this);
        }
        /*-----------------
            private method
        ------------------*/

      }, {
        key: "_active",
        value: function _active() {
          _active2.call(this);
        }
      }, {
        key: "_deactive",
        value: function _deactive() {
          _deactive2.call(this);
        }
      }, {
        key: "_init",
        value: function _init() {
          _init3.call(this);
        }
      }, {
        key: "_init_btn",
        value: function _init_btn(width, height) {
          _init_btn2.call(this, width, height);
        }
      }, {
        key: "_init_style",
        value: function _init_style() {
          _init_style2.call(this);
        }
      }, {
        key: "_init_event",
        value: function _init_event() {
          _init_event2.call(this);
        }
      }, {
        key: "_init_option",
        value: function _init_option(option) {
          Util.init_option.call(this, option);
        }
      }, {
        key: "_handle_touchEnd",
        value: function _handle_touchEnd(evt) {
          _handle_touchEnd2.call(this, evt);
        }
      }, {
        key: "_handle_touchMove",
        value: function _handle_touchMove(evt) {
          _handle_touchMove2.call(this, evt);
        }
      }, {
        key: "_move",
        value: function _move(dis) {
          _move2.call(this, dis);
        }
      }, {
        key: "_rotate",
        value: function _rotate(nowPos, dis) {
          _rotate2.call(this, nowPos, dis);
        }
      }, {
        key: "_scale",
        value: function _scale(dis) {
          _scale2.call(this, dis);
        }
      }, {
        key: "_delete",
        value: function _delete() {
          _delete2.call(this);
        }
      }, {
        key: "_drawCanvas",
        value: function _drawCanvas() {
          _drawCanvas3.call(this);
        }
      }, {
        key: "touchCb",
        set: function set(cb) {
          this._touchCb = cb;
        }
      }, {
        key: "moveCb",
        set: function set(cb) {
          this._moveCb = cb;
        }
      }, {
        key: "scaleCb",
        set: function set(cb) {
          this._scaleCb = cb;
        }
      }, {
        key: "rotateCb",
        set: function set(cb) {
          this._rotateCb = cb;
        }
      }, {
        key: "deleteCb",
        set: function set(cb) {
          this._deleteCb = cb;
        }
      }, {
        key: "active",
        set: function set(bool) {
          if (bool) {
            this._active();
          } else {
            this._deactive();
          };
        },
        get: function get() {
          return this._isActive;
        }
      }, {
        key: "base64",
        get: function get() {
          return this.convert();
        }
      }]);

      return Icon_Item;
    }();

    module.exports = Icon_Item;
  }, { "../Util/Util": 43, "./_active": 18, "./_convert": 20, "./_deactive": 21, "./_delete": 22, "./_drawCanvas": 23, "./_handle_touchEnd": 24, "./_handle_touchMove": 25, "./_init": 26, "./_init_btn": 27, "./_init_event": 28, "./_init_style": 29, "./_move": 30, "./_rotate": 31, "./_scale": 33 }], 18: [function (require, module, exports) {
    function _active() {
      var btnList = [this._rotateBtn, this._closeBtn, this._scaleBtn];
      this._isActive = true;
      btnList.forEach(function (btn) {
        btn.style.display = 'block';
      });
    };

    module.exports = _active;
  }, {}], 19: [function (require, module, exports) {
    module.exports = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAvVBMVEUAAAC/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7////+/v7/l5eX29vbIyMj7+/v4+PjHx8fb29v9/f3BwcHY2NjDw8Pz8/Pe3t7Gxsbt7e3j4+Po6OjV1dXMzMzKysru7u7Pz8/g4ODw8PBgOdjzAAAAJXRSTlMAEB/1BAF0d+Xp+G+sFb1BG9rSjE027oO3Yy3MsGlcxwqRpFIoFpuNcwAACM9JREFUeNrs2m1T2kAUhmFCeAdBoIBFUHw5awiaJoGAgv3/f6tfCE9gExs4Oagz3h/bTplrsps9rOZ++umnnzKpYBj5fN4wCrlvmTF8qN81mp1KTYXVKp1m467+MDRy36Li4023WVEfVWl2bx6LuS9coVceVVW6qqNy72sut/x4ZKrjMkfjfO5rlS9dq9O6Ln0dizG+VZxu619h/xdb9zXFrXbf+uTNPxm31X/643lTz/uj/lN7PMl9WheDxHfU4t2drwLfsinMtvxgNXffF4nvscFF7lO66Ma/pdbucmNTcvZm6a7j32LdT6AYAzMOMQ80Q7wmmMdhzMGZ932h1Nc3w+tqRsc0W73qW6dfOucx+asdo3Do+JwYS/tX7kzlr9RBb082nZr99KYOujrLGVkomwcPw/WJl+8ePBazLL++hgezyGJuEz97vjiYXIY50Yql2j5j6VA2Oct9Sq0kedZfNlU0D4xMKJ6K1rzMSdWq7u0NbVHxF9jeXqm2ciIVyyraq0XZZ72qaGWJ5WU0VKTphmTaTFWkRvYHfb6jIr04JJUzV5E6WR8pvYpCU58k89cKVXqZOn6ZCrk2yWa7CplZTiw3CnkByRd4Ct1k5hgr9GbROZq9KTTOyFFSyHXoPDmuQuVMHGWFlnS+lhlL6pGzPKBzFkTO+Trb8TsyIfp03vzIHPmb+97Ff/Vs0bmznvHxvLdwz8QpOKPzN5viPOlxxnac52uGgyNZ44w/fayfdPA8bPqcbDyTjnHq3N5grCuJ1dUocg+QhUWRRB+O/gHWgnmctDBe+RTpZWqRaLPpC0XzcZ60TrnaxffazZ5DKSkJ1tK+JMC334vjN8gV5pIDh5QEjkPJEnd3xdMnXldzyEjg0CXuybPKsLab2x3dAYmIQ5c4u6m+NjzKUbjdbXRLd0Ai5NAlM293B1k47StIoDnkJHDokuCkd3DexAbRHJDIOSDRP93Mp4fs3lhrJ84BiZhDlzjr3ZvrhNndJ/SkRCVwoCeK5Kuwh7Q7vR37bBkSlkNfEu3CkTt96hBXwncgZ/dPSqkcRl8bTRgSvgNtwr/qG2kgg919OyGGhO1Au7v6QZph0QzvTCxiSCQcZIVzsJlieOyqbXNCHAnfgXY39d30D2RhE0Mi4yB7kfqRDLThnS3hO9Ay7S6ZVMMH4hBDIuUgJ3wk1UnKi0U8EL6E70DLdFePxfBQ9xxiSOQc5Hjh8V5MdeEwJ8SX8B1onuoi4j48Q2xiSCQdZIdnyf0HDsPE1xCGRNKB7++mkeJnIT4xJLIO8lPcQ9yGFw5EDImMA4UXEbeJjjz+Q4ZE2oHPzSdBStjqDIm0A9u9lAS5xvzOkEg7MM1fJzgu1bYVcSTiDlqpbZcJ4wlWFksi6sDaSh5TGlhZPImwA2urEeso9LGyRCUW04G11S/EQXpq24zYElkHzdS2XuzLF6chXyLiQG8fvYBHGHxFJHyHPgKP4iBV3L+LSPgO/W6+GuN4VNtskpHwHchW2x6Tf0tuTSQk4TvQOvm367r4KiIk4TuQm3y/dYVbByEJ36HfQTR1SAU319lJhBy4z65ojgn2epYSIQd2u3EIGYYXc0QCEq5Db4GzPf7Hbe+UsUTGQe9JP4ar46WVsUTEQW7SkHKHASVriYADQ8pd0peRFWUvEXDQKukrSROTVuYSAQcFSQdJB1dzmUuyd+CarpN0HlokJ4GDn5V0ItZwHvIl4g6ciLUDR1FtIxKUwMFPbSvsQ4ztH3skIJFwkIcZRRACie6QhOD++pkEJBIOesZNthgEEt3x/SD0V3f8pW8I+UfNvdsgEAQxABUpjfDJL6T/tggtcGLdi66Bk14CuzseP18NeT2vB4njV3I1SByDhCH7z687IrnS/0gcg0QhcEQBR0n8iAKHRnCUhA+NcIwHR0n8GA8XK3CUxC9W81XXHY/HIIGr7vj44A6Yxw+PD/tzkDsGCTwHrQ907hgk8EC3Ppm6Y5DIk+n4iO2OQUKP2PNYwR0tyWK5jxWmQY87BgkPevbRmzt2iY/eehjqjl3iw9B9PO0Ol/R4GgID4GBJBwYgwgEOlXSEA0I14GBJh2og5gQOlnTMCYJn4GBJB88gCggOlnQUEMKZ7HBJwpkQl3WHSxKXhQCzO1ySADNEys3hkoqUQ8jfHC5JyB/WLtzhkqxdwCIMO1ySRZhlNQkcLvHVpNs9lxJwkGS+itxvsL7HDpdkfW9aqPyAQyW0UNkrruBQCay4bkvH7nBJlo5hDRwcLOk1cFjMZ4dLspgPVQngYElXJUB5BTtckvIKqBMBB0u6TgQKXtjhkhS8QOUOOEAClTtVgqQOl3QJEtVSvU84UPKGWqoqCqsPrQ6X/BVopvoXqtta0g6XlAOr21Kml4+1pB0uKcdQpjc2eh/1tcHBknYc6c48WTj5be9MdxMEojB6B7CgrEqDUXE3V6u2QQ0ajfr+j9Wmf27iuGAnLE45CQ9wwkAyf76z4EzS8iAT8uAHJ/ua0AQomaTjQSbkITYByh+uiDur6XiQCXmIj7LSTC6/MpiOB5nwHlOBmVzwLoeLyYQ8UmFKHtxwsSc6JZ0P/JS0+Lh3HvDj3v98bh2YJAP48iQJ5IlEyJPtkCekIk/aBkAXvoOIX070Mv90O8iVzc9rcUSiWybSON7V9BuCxNcnF61LJyN4eN2M4GXYcfOyYUcAFiKRVWozZPBLGT+VOkdLgWCRznHy1jEfCC6TzRJHtCXKmssTmk8//T+G7NDeArzisnjuXZAFEbxpkCl2U0We/SaeJ5OIN3vkUX0bMsf2VbzGIdqe5/ccztvogNdQhx7kgt2s4g2Wx+i0i9czMprP1vHuFB2XeINq04bcGHTr+IDVavXx8+AD6t0B5ErFHdVQlNrIrUD+MLOPIvRNBkVB0Tv4Nzq6AsXCa1kBPkdgtTwoIpqrh0llqqHualBgKpOe7xh4D8Pxe5MifNwJYO2xObSchlGjP5PRcKyhOW4X58t+Co0xRVEYK/QxKikpeR2+AbX3wXOaTcg4AAAAAElFTkSuQmCC';
  }, {}], 20: [function (require, module, exports) {
    function _convert() {
      var containerClientRect = this._container.getBoundingClientRect();

      this._canvas.width = containerClientRect.width * this._ratio;
      this._canvas.height = containerClientRect.height * this._ratio;
      this._canvas.style.width = '100%';

      this._drawCanvas();

      return this._canvas.toDataURL();
    };

    module.exports = _convert;
  }, {}], 21: [function (require, module, exports) {
    function _deactive() {
      var btnList = [this._rotateBtn, this._closeBtn, this._scaleBtn];
      this._isActive = false;

      btnList.forEach(function (btn) {
        btn.style.display = 'none';
      });
    };

    module.exports = _deactive;
  }, {}], 22: [function (require, module, exports) {
    function _delete() {
      var _this8 = this;

      this._dom.remove();
      this._deleteCb(this);
      Object.keys(this).forEach(function (key) {
        _this8[key] = null;
      });
    };

    module.exports = _delete;
  }, {}], 23: [function (require, module, exports) {
    function _drawCanvas() {
      var ctx = this._canvas.getContext("2d"),
          width = this._size[0] * this._ratio,
          height = this._size[1] * this._ratio,
          x = this._dom.offsetLeft * this._ratio + width / 2,
          y = this._dom.offsetTop * this._ratio + height / 2,
          rad = this._rotation * (Math.PI / 180);

      ctx.translate(x, y);
      ctx.rotate(rad);
      ctx.drawImage(this._imgEle, -width / 2, -height / 2, width, height);
      ctx.rotate(-rad);
      ctx.translate(-x, -y);
    };

    module.exports = _drawCanvas;
  }, {}], 24: [function (require, module, exports) {
    function _handle_touch(evt) {
      var btnList = [this._rotateBtn, this._closeBtn, this._scaleBtn];

      if (evt && evt.target === this._closeBtn) return this._delete();

      if (this._isActive && !this._isMove) {
        this._deactive();
      } else if (!this._isActive && !this._isMove) {
        this._active();
      }

      this._touchCb(this);
      this._isMove = false;
      this._touch_screenPos = null;
    };

    module.exports = _handle_touch;
  }, {}], 25: [function (require, module, exports) {
    function _handle_move(evt) {

      evt.preventDefault();

      this._isMove = true;

      if (!this._isActive) return;

      if (!this._touch_screenPos) return this._touch_screenPos = [evt.touches[0].clientX, evt.touches[0].clientY];

      var nowPos = [evt.touches[0].clientX, evt.touches[0].clientY],
          dis = [nowPos[0] - this._touch_screenPos[0], nowPos[1] - this._touch_screenPos[1]];

      if (evt.target === this._dom) {
        this._move(dis);
      } else if (evt.target === this._scaleBtn) {
        this._scale(dis);
      } else if (evt.target === this._rotateBtn) {
        this._rotate(nowPos, dis);
      }

      this._touch_screenPos = [evt.touches[0].clientX, evt.touches[0].clientY];
    };

    module.exports = _handle_move;
  }, {}], 26: [function (require, module, exports) {
    function _init() {
      var _this9 = this;

      var img = new Image(+this._iconStyle.width + 'px', +this._iconStyle.height + 'px');

      img.onload = function () {
        _this9._imgEle = img;

        _this9._init_style();

        _this9._init_event();

        _this9._container.appendChild(_this9._dom);
      };

      img.src = this._imgSrc;
    }

    module.exports = _init;
  }, {}], 27: [function (require, module, exports) {
    var BTN_IMGS = [require('./_rotateBtn_img_base64'), require('./_closeBtn_img_base64'), require('./_scaleBtn_img_base64')];

    function _init_btn(iconWidth, iconHeight) {
      var btnList = [this._rotateBtn, this._closeBtn, this._scaleBtn],
          imgList = BTN_IMGS;

      var btn_position = [[-this._btnStyle.width / 2, -this._btnStyle.height / 2], [iconWidth - this._btnStyle.width / 2, -this._btnStyle.height / 2], [iconWidth - this._btnStyle.width / 2, iconHeight - this._btnStyle.height / 2]];

      btn_position.forEach(function (position, index) {
        btnList[index].style.left = position[0] + "px";
        btnList[index].style.top = position[1] + "px";
        btnList[index].style['background-image'] = "url(" + imgList[index] + ")";
      });
    };

    module.exports = _init_btn;
  }, { "./_closeBtn_img_base64": 19, "./_rotateBtn_img_base64": 32, "./_scaleBtn_img_base64": 34 }], 28: [function (require, module, exports) {
    function _init_event() {
      this._dom.addEventListener('touchend', this._handle_touchEnd.bind(this), false);
      this._dom.addEventListener('touchmove', this._handle_touchMove.bind(this), false);
    };

    module.exports = _init_event;
  }, {}], 29: [function (require, module, exports) {
    function _init_style() {

      var setStyle = function setStyle(ele, style) {
        for (var i in style) {
          var value = style[i];
          if (i === 'width' || i === 'height') value = value + 'px';

          ele.style[i] = value;
        }
      };

      setStyle(this._dom, this._iconStyle);
      setStyle(this._closeBtn, this._btnStyle);
      setStyle(this._scaleBtn, this._btnStyle);
      setStyle(this._rotateBtn, this._btnStyle);

      this._dom.appendChild(this._closeBtn);
      this._dom.appendChild(this._scaleBtn);
      this._dom.appendChild(this._rotateBtn);

      this._dom.style['background-image'] = "url(" + this._imgSrc + ")";
      this._dom.style['transform-origin'] = 'center';

      this._init_btn(this._iconStyle.width, this._iconStyle.height);
    };

    module.exports = _init_style;
  }, {}], 30: [function (require, module, exports) {
    function _move(dis) {
      this._dom.style.left = this._dom.offsetLeft + dis[0] + "px";
      this._dom.style.top = this._dom.offsetTop + dis[1] + "px";
      this._moveCb(this);
    };

    module.exports = _move;
  }, {}], 31: [function (require, module, exports) {
    var glMatrix = require('gl-matrix');
    var TAG = ['transform', '-ms-transform', '-webkit-transform'];

    function _rotate(nowPos, dis) {
      var _this10 = this;

      var now_vec = glMatrix.vec2.fromValues(nowPos[0], nowPos[1]),
          old_vec = glMatrix.vec2.fromValues(this._touch_screenPos[0], this._touch_screenPos[1]),
          rad = glMatrix.vec2.angle(old_vec, now_vec),
          deg = rad * 180 / Math.PI;

      if (this._rotation >= 0 && this._rotation < 90) {
        if (dis[0] > 0) {
          this._rotation += deg * 5;
        } else {
          this._rotation -= deg * 5;
        }
      } else if (this._rotation >= 90 && this._rotation < 180) {
        if (dis[1] > 0) {
          this._rotation += deg * 5;
        } else {
          this._rotation -= deg * 5;
        }
      } else if (this._rotation >= 180 && this._rotation < 270) {
        if (dis[0] < 0) {
          this._rotation += deg * 5;
        } else {
          this._rotation -= deg * 5;
        }
      } else if (this._rotation >= 270 && this._rotation < 360) {
        if (dis[1] < 0) {
          this._rotation += deg * 5;
        } else {
          this._rotation -= deg * 5;
        }
      }

      this._rotation %= 360;

      if (this._rotation < 0) this._rotation = 360 + this._rotation;

      TAG.forEach(function (tag) {
        _this10._dom.style[tag] = "rotate(" + Math.floor(_this10._rotation) + "deg)";
      });

      this._rotateCb(this);
    };

    module.exports = _rotate;
  }, { "gl-matrix": 53 }], 32: [function (require, module, exports) {
    module.exports = 'data:image/png;base64,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';
  }, {}], 33: [function (require, module, exports) {
    var glMatrix = require('gl-matrix');

    function _scale(dis) {
      var vec = glMatrix.vec2.fromValues(dis[0], dis[1]),
          distance = glMatrix.vec2.length(vec);

      if (this._rotation >= 0 && this._rotation < 45 || this._rotation >= 225 && this._rotation < 315 || this._rotation >= 315 && this._rotation < 360) {
        if (dis[0] > 0) {
          this._size[0] += distance * 2;
          this._size[1] += distance * 2;
        } else {
          this._size[0] -= distance * 2;
          this._size[1] -= distance * 2;
        }
      } else if (this._rotation >= 45 && this._rotation < 135 || this._rotation >= 135 && this._rotation < 225) {
        if (dis[0] > 0) {
          this._size[0] -= distance * 2;
          this._size[1] -= distance * 2;
        } else {
          this._size[0] += distance * 2;
          this._size[1] += distance * 2;
        }
      }

      if (this._size[0] < this._iconStyle.width) this._size = [this._iconStyle.width, this._iconStyle.height];

      if (this._size[0] > this._maxSize) this._size = [this._maxSize, this._maxSize];

      this._dom.style.width = this._size[0] + 'px';
      this._dom.style.height = this._size[1] + 'px';
      this._init_btn(this._size[0], this._size[1]);
      this._scaleCb(this);
    };

    module.exports = _scale;
  }, { "gl-matrix": 53 }], 34: [function (require, module, exports) {
    module.exports = 'data:image/png;base64,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';
  }, {}], 35: [function (require, module, exports) {
    var APIAbstract = require('./APIAbstract/APIAbstract'),
        Canvas_Item = require('./Canvas_Item/Canvas_Item'),
        Share_Item = require('./Share_Item/Share_Item'),
        Util = require('./Util/Util');

    var _api_config = require('./_api_config'),
        _getUrlParam2 = require('./_getUrlParam'),
        _init4 = require('./_init'),

    //wechat
    _setWechatShare = require('./wechat/_setWechatShare'),
        _configJSSDK2 = require('./wechat/_configJSSDK');

    var SERVER_CONFIG = {
      host: 'http://test.swarmgate.com.cn',
      token: 'fsiisq1526695953',
      statFid: 3
    };

    var Sdk = function () {
      function Sdk(options) {
        _classCallCheck(this, Sdk);

        this._canvas = null;
        this._share = null;

        this._debug = false;
        this._api_host = SERVER_CONFIG.host;
        this._token = SERVER_CONFIG.token;
        this._api_config = _api_config;
        this._models = {};

        this._urlParam = {};
        this._url_template = '?code=${code}&test=${test}&sid=${sid}';
        //init
        this._init_option(options);
        this._getUrlParam();
        this._init(APIAbstract);
      }
      /*-------------------
          public method
      --------------------*/


      _createClass(Sdk, [{
        key: "createCanvas",
        value: function createCanvas(container, option) {
          return this._canvas = new Canvas_Item(container, option);
        }
      }, {
        key: "createShare",
        value: function createShare(bgSrc, option) {
          return this._share = new Share_Item(bgSrc, option);
        }
      }, {
        key: "setWechatShare",
        value: function setWechatShare(title, desc, link, imgUrl, errorCb, successCb) {
          _setWechatShare.call(this, title, desc, link, imgUrl, errorCb, successCb);
        }
        /*------------
            微信API
        -------------*/

      }, {
        key: "_configJSSDK",
        value: function _configJSSDK(errorCb, successCb) {
          _configJSSDK2.call(this, errorCb, successCb);
        }
      }, {
        key: "_getOAuthCode",
        value: function (_getOAuthCode2) {
          function _getOAuthCode() {
            return _getOAuthCode2.apply(this, arguments);
          }

          _getOAuthCode.toString = function () {
            return _getOAuthCode2.toString();
          };

          return _getOAuthCode;
        }(function () {
          _getOAuthCode.call(this);
        })
      }, {
        key: "_getWXInfo",
        value: function (_getWXInfo2) {
          function _getWXInfo(_x, _x2, _x3) {
            return _getWXInfo2.apply(this, arguments);
          }

          _getWXInfo.toString = function () {
            return _getWXInfo2.toString();
          };

          return _getWXInfo;
        }(function (code, errorCb, successCb) {
          _getWXInfo.call(this, code, errorCb, successCb);
        })
        /*-------------------
            private method
        --------------------*/

      }, {
        key: "_init",
        value: function _init(API) {
          _init4.call(this, API);
        }
      }, {
        key: "_init_option",
        value: function _init_option(option) {
          Util.init_option.call(this, option);
        }
      }, {
        key: "_getUrlParam",
        value: function _getUrlParam() {
          _getUrlParam2.call(this);
        }
      }]);

      return Sdk;
    }();

    module.exports = Sdk;
  }, { "./APIAbstract/APIAbstract": 1, "./Canvas_Item/Canvas_Item": 5, "./Share_Item/Share_Item": 36, "./Util/Util": 43, "./_api_config": 45, "./_getUrlParam": 46, "./_init": 47, "./wechat/_configJSSDK": 49, "./wechat/_setWechatShare": 50 }], 36: [function (require, module, exports) {
    var Util = require('../Util/Util'),
        _drawCanvas4 = require('./_drawCanvas'),
        _genQRCode2 = require('./_genQRCode'),
        _init5 = require('./_init'),
        _loadImg3 = require('./_loadImg'),
        _create = require('./_create');

    var SODA_SRC = require('./_sodaImg_base64');

    var RATIO = 2;

    var ELE_STYLE = {
      'position': 'absolute'
    };

    var Share_Item = function () {
      function Share_Item(bgSrc, option) {
        _classCallCheck(this, Share_Item);

        this._canvas = document.createElement('canvas');

        this._qr_img = null;
        this._bg_img = null;
        this._soda_img = null;
        this._submission_img = null;

        this._soda_src = SODA_SRC;
        this._submission_src = null;
        this._bg_src = bgSrc;
        this._url = null;

        this._init_option(option);
        this._init();
      }
      /*-------------------
          public method
      --------------------*/


      _createClass(Share_Item, [{
        key: "create",
        value: function create(url, submissionImgSrc, cb) {
          _create.call(this, url, submissionImgSrc, cb);
        }
      }, {
        key: "_init",

        /*-------------------
            private method
        --------------------*/
        value: function _init() {
          _init5.call(this);
        }
      }, {
        key: "_init_option",
        value: function _init_option(option) {
          Util.init_option.call(this, option);
        }
      }, {
        key: "_drawCanvas",
        value: function _drawCanvas(cb) {
          _drawCanvas4.call(this, cb);
        }
      }, {
        key: "_genQRCode",
        value: function _genQRCode(url, cb) {
          _genQRCode2.call(this, url, cb);
        }
      }, {
        key: "_loadImg",
        value: function _loadImg(src, cb) {
          _loadImg3.call(this, src, cb);
        }
      }]);

      return Share_Item;
    }();

    module.exports = Share_Item;
  }, { "../Util/Util": 43, "./_create": 37, "./_drawCanvas": 38, "./_genQRCode": 39, "./_init": 40, "./_loadImg": 41, "./_sodaImg_base64": 42 }], 37: [function (require, module, exports) {
    function _create(url, src, cb) {
      var _this11 = this;

      var check = function check() {
        if (!_this11._bg_img) return console.log('bg img error');

        if (!_this11._submission_img || !_this11._qr_img) return;

        _this11._drawCanvas(cb);
      };

      this._loadImg(src, function (img) {
        _this11._submission_img = img;
        check();
      });

      this._genQRCode(url, check.bind(this));
    };

    module.exports = _create;
  }, {}], 38: [function (require, module, exports) {
    var TOP_RATIO = 0.15,
        LEFT_RATIO = 0.05;

    function _drawCanvas(cb) {
      var _this12 = this;

      var callCount = 0,
          ctx = this._canvas.getContext("2d"),
          width = this._bg_img.width,
          height = this._bg_img.height;

      var drawBg = function drawBg(cb) {
        ctx.drawImage(_this12._bg_img, 0, 0, width, height);
        cb();
      };

      var drawSub = function drawSub(cb) {
        var subWidth = 0.9 * width,
            subHeight = subWidth / (_this12._submission_img.width / _this12._submission_img.height);

        ctx.drawImage(_this12._submission_img, LEFT_RATIO * width, TOP_RATIO * width, subWidth, subHeight);
        cb();
      };

      var drawSoda = function drawSoda(cb) {
        var subWidth = 0.9 * width,
            subHeight = subWidth / (_this12._soda_img.width / _this12._soda_img.height);

        ctx.drawImage(_this12._soda_img, LEFT_RATIO * width, TOP_RATIO * width, subWidth, subHeight);
        cb();
      };

      var drawQR = function drawQR(cb) {
        ctx.drawImage(_this12._qr_img, 540, 845, 100, 100);
        cb();
      };

      var run = function run() {
        var callList = [drawBg, drawSub, drawSoda, drawQR];

        callList[callCount].call(_this12, function () {
          callCount += 1;

          if (callCount < callList.length) {
            run();
          } else {
            cb(_this12._canvas.toDataURL());
          }
        });
      };

      run();
    };

    module.exports = _drawCanvas;
  }, {}], 39: [function (require, module, exports) {
    var QRCode = require('qrcode');

    function _genQRCode(url, cb) {
      var _this13 = this;

      QRCode.toDataURL(url, { errorCorrectionLevel: 'M' }, function (err, dataURL) {
        if (err) console.log(err);

        _this13._loadImg(dataURL, function (img) {
          _this13._qr_img = img;
          cb();
        });
      });
    };

    module.exports = _genQRCode;
  }, { "qrcode": 54 }], 40: [function (require, module, exports) {
    function _init() {
      var _this14 = this;

      var init_soda = function init_soda(img) {
        _this14._soda_img = img;
      };

      var init_size = function init_size(img) {
        _this14._bg_img = img;
        _this14._canvas.width = img.width;
        _this14._canvas.height = img.height;
      };

      this._loadImg(this._bg_src, init_size);
      this._loadImg(this._soda_src, init_soda);
    };

    module.exports = _init;
  }, {}], 41: [function (require, module, exports) {
    function _loadImg(src, cb) {
      var _this15 = this;

      var img = new Image();

      img.onload = function () {
        cb.call(_this15, img);
      };

      img.src = src;
    };

    module.exports = _loadImg;
  }, {}], 42: [function (require, module, exports) {
    module.exports = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAArUAAANkCAMAAACeayJNAAAC91BMVEUAAAABAAABAAACBQMBAwIBAAABBAIBAQEBAAAAAAAAAAAAAAADAgIBAAAAAAAAAAACAQEBAAACAQEAAAAAAAAAAAAAAAABAQEDAgIAAAACAgIAAAAAAAAAAAABAAABAQFLjnP19fWZmZkRGBX////29vY3Nzf8/PzW0dH////s6usOaEOlpaUHLh79/Pz+/v7m5ebIysmysbJYV1doaGhHR0evr6/////8/Pzb2tv//v7+/f6Hh4cRakX////BwMH//v7j4+P///8OaENCd2DEw8PCwsJ3d3f+/f7////q6urHxsaTk5MOaEMLUTR8fHyzsrIOaEM0NDQOaEPBwcFgXl5gm4NRkncOaEM0NDSMiopoaGiCgID///8OaEPstdIHAwPv7+45NjZ7eXn23er88fb8+/vtutWMior+/v73+vitq6v34u3z9/T77PP55/ATa0bg6+e+vL0gclBZV1ebmZvNy8z99vn00+RwpY9raGjsBRkuelsYbkvyzuH4BCcXFBTv9PHvwtrC2dGe+P/n8e312Ofg3t610cSjxrhBiGtKR0eK8P0pdVbhABfl7OCav7ApJSW81cs7fmPS492uy8B+rprY5+HZq8O6jqXxyN3c5NTgw9DDlqzo8Obs7t/XAxPqtNHksczMqbuHtKH5Ag/p5OXf6NzK3dXm59S6o7CQuahZ4P6d7PrO4dainKO16vTb4cfVtsTMnLXvoKldmoFWlXt06f/j0t370NSMlJRmn4j2VmD1PFDKAQ26AgnR5/f1xsfzjphPf20yLy+y+/8xzf+//P772t/U38H7KDarAQg/y/H09elwioJ0cnIXzP9VweHs2tf7ucRihnn85Ob4dn+9Gx8puv3e9/iD1emk4eip19fZ2dSwuLmnpqeFhITwZ3LjJDaXAQXP//8/3P9w2fHRfYTCO0EsquOty9DH4MPztraCkI7IWGNiX19znrzN2bPD1K56xti4iYcRDQ19AAygbX5EQUEhHR2aj42pWGBpMj6ZOT0XAAAAXXRSTlMAAgYKDhMYuh2LqqIwKniwNia1gpRtv0IiZk87XkibV/4q38eXFcc3/k/77d7Wt6jz6ObU0cy8aF3z8eLcz0Psw619XBfNed7TysSHdy/ut5uThHlgTNetpZleWEqUjnqsAAAXPUlEQVR42uzBgQAAAACAoP2pF6kCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGD24EAAAAAAAMj/tRFUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVYU9OBAAAAAAAPJ/bQRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWEPDgQAAAAAgPxfG0FVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVdiDAwEAAAAAIP/XRlBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFfbgQAAAAAAAyP+1EVRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVhT04EAAAAAAA8n9tBFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVYQ8OBAAAAACA/F8bQVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV2IMDAQAAAAAg/9dGUFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVYd9OXpsIwzCAT933Xdw1ggsuuCEudcUNRUVcUEHe50OwUyY0OnFAG8gIsUSSQCBkFW+tPZQW2lN6aI6959Sz/gX9H/ym800+im1vEwu+v0ta0t4eXp7v/WYYY4wxxhj7nxy+fvHQzSudJJmd908dunTQYGwxO3rrvkVW14d333p7v/T2fut5/5mo89TFw/K7FbfvGIwtMgdvXSHzQ+9XMUv3j2/vLTr76hpw4rbB2OLR0XH0FJk9P8Qc+oebSTtScABc43HLFokOmdmb1NXbLeY04TYqMSIb0mODsUWgo2PJ4dPU9UXMZzJCUgwenrVsEZCZXXqp0+wV8ys1SKpBch/wRoH9Ozqz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';
  }, {}], 43: [function (require, module, exports) {
    var _init_option = require('./_init_option');

    var Util = function () {
      function Util() {
        _classCallCheck(this, Util);
      }

      _createClass(Util, null, [{
        key: "init_option",
        value: function init_option(option) {
          _init_option.call(this, option);
        }
      }]);

      return Util;
    }();

    module.exports = Util;
  }, { "./_init_option": 44 }], 44: [function (require, module, exports) {
    function _init_options(options) {
      for (var i in options) {
        if (i in this) this[i] = options[i];

        if ("_" + i in this) this["_" + i] = options[i];
      }
    };

    module.exports = _init_options;
  }, {}], 45: [function (require, module, exports) {
    var config = {
      /*------------
          活动接口
      -------------*/
      app: {
        modelName: "ApiOchirly",
        verbs: {
          sodaStart: {
            get: [],
            post: []
          },
          sodaEditImg: {
            get: [],
            post: ['img']
          },
          sodaAddPoint: {
            get: [],
            post: ['pid']
          },
          sodaGetSubmissionByPid: {
            get: [],
            post: ['pid']
          },
          sodaGetRank: {
            get: [],
            post: []
          },
          sodaMember: {
            get: [],
            post: ['tel', 'authCode', 'name', 'address', 'phone', 'section']
          },
          sendCode: {
            get: [],
            post: ['tel']
          },
          getOchirlyOauthCode: {
            get: ['target'],
            post: []
          },
          getOchirlyOpenIDInfoWithCode: {
            get: [],
            post: ['code', 'openidname']
          },
          sodaUpdateInfo: {
            get: [],
            post: ['name', 'address', 'phone', 'section']
          }
        }
      },
      /*------------
          统计接口
      -------------*/
      stat: {
        modelName: "ApiCustomizeform",
        verbs: {
          addSubmission: {
            get: ['fid'],
            post: ['type', 'detail']
          }
        }
      },
      /*------------
          微信API
      -------------*/
      wechat: {
        modelName: "ApiPublic",
        verbs: {
          getJSApiConfig: {
            get: [],
            post: ['url']
          }
        }
      }
    };

    module.exports = config;
  }, {}], 46: [function (require, module, exports) {
    function _getUrlParam() {
      var url_template = this._url_template,
          keys = [];

      var getParam = function getParam(name, str) {

        var val = '',
            reg = new RegExp('[\\?&]' + name + '=([^&]+)', 'i');

        if (reg.test(str)) {
          val = RegExp.$1;
        }

        return val ? decodeURIComponent(val) : '';
      };

      var getKey = function getKey(url) {
        var start_point = url.indexOf('=${'),
            end_point = url.indexOf('}', start_point),
            key = null;

        if (start_point === -1) return;

        if (end_point === -1) return;

        key = url.substring(start_point + 3, end_point);

        keys.push(key);

        url = url.replace("?" + key + "=${" + key + "}", '');
        url = url.replace("&" + key + "=${" + key + "}", '');

        getKey(url);
      };

      getKey(url_template);

      for (var i = 0; i < keys.length; i++) {
        if (getParam(keys[i], window.location.href) === '') continue;
        this._urlParam[keys[i]] = getParam(keys[i], window.location.href);
      }
    }

    module.exports = _getUrlParam;
  }, {}], 47: [function (require, module, exports) {
    function _init(API) {
      for (var m in this._api_config) {
        this._models[m] = new API(this._api_host, this._token, this._api_config[m]);
      }
    };

    module.exports = _init;
  }, {}], 48: [function (require, module, exports) {
    var Sdk = require('../Sdk');

    var img = document.querySelector('#canvas'),
        sdk = new Sdk(),
        item = sdk.createShare('images/index_bg.jpg');

    document.body.style.margin = 0;
    img.style.width = '100%';
    img.style.position = 'absolute';
    img.style.top = 0;

    window.item = item;
    window.sdk = sdk;
  }, { "../Sdk": 35 }], 49: [function (require, module, exports) {
    var MSG = {
      "0": "getJSApiConfig error"
    };

    var API_LIST = ["onMenuShareTimeline", "onMenuShareAppMessage", "showAllNonBaseMenuItem"];

    function _configJSSDK(errorCb, successCb) {
      var _this16 = this;

      var url = window.location.href.split('#')[0];

      // let init_statHandler=()=>{
      //     this._statHandler.onRequest=(fid,type,detail)=>{
      //         this._models.stat.request('addSubmission',{get:{fid:fid},post:{type:type,detail:detail}},(data)=>{
      //             if(this._debug)
      //                 console.log('statHandler->addSubmission',data);
      //         });
      //     };

      //     this._statHandler.markPV();
      // };

      var config = function config() {
        var jsApi = {
          debug: false, //this._debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: _this16._jsSDKConfig.appid, // 必填，公众号的唯一标识
          timestamp: _this16._jsSDKConfig.timestamp, // 必填，生成签名的时间戳
          nonceStr: _this16._jsSDKConfig.noncestr, // 必填，生成签名的随机串
          signature: _this16._jsSDKConfig.signature, // 必填，签名，见附录1
          jsApiList: API_LIST //  ,"hideMenuItems"必填，需要使用的JS接口列表，所有JS接口列表见附录2  
        };

        wx.config(jsApi);
        //init_statHandler();
      };

      this._models.wechat.request('getJSApiConfig', { post: { url: url } }, function (data) {
        if (_this16._debug) console.log('getJSApiConfig', data);

        if (data.error_code == '200') {
          _this16._jsSDKConfig = data.data;
          config();
          successCb();
        } else {
          errorCb({ api_error_code: data.code, msg: { id: 0, messageList: MSG } });
        }
      });
    };

    module.exports = _configJSSDK;
  }, {}], 50: [function (require, module, exports) {
    function setWechatShare(title, desc, link, imgUrl, errorCb, successCb) {
      var set = function set() {
        wx.onMenuShareTimeline({
          title: title,
          link: link,
          imgUrl: imgUrl,
          success: function success() {
            //用户确认分享后执行的回调
            // alert(linkUrl);
          },
          cancel: function cancel() {
            //用户取消分享后执行的回调
          }
        });

        wx.onMenuShareAppMessage({
          title: title,
          desc: desc,
          link: link,
          imgUrl: imgUrl,
          success: function success() {
            //用户确认分享后执行的回调
            // alert(linkUrl);
          },
          cancel: function cancel() {
            //用户取消分享后执行的回调
          }
        });

        successCb();
      };

      if (!this._jsSDKConfig) return this._configJSSDK(errorCb, set);

      set();
    };

    module.exports = setWechatShare;
  }, {}], 51: [function (require, module, exports) {
    'use strict';

    var G = require('window-or-global');

    module.exports = function () {
      return typeof G.Promise === 'function' && typeof G.Promise.prototype.then === 'function';
    };
  }, { "window-or-global": 81 }], 52: [function (require, module, exports) {
    'use strict';

    /******************************************************************************
     * Created 2008-08-19.
     *
     * Dijkstra path-finding functions. Adapted from the Dijkstar Python project.
     *
     * Copyright (C) 2008
     *   Wyatt Baldwin <self@wyattbaldwin.com>
     *   All rights reserved
     *
     * Licensed under the MIT license.
     *
     *   http://www.opensource.org/licenses/mit-license.php
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     *****************************************************************************/

    var dijkstra = {
      single_source_shortest_paths: function single_source_shortest_paths(graph, s, d) {
        // Predecessor map for each node that has been encountered.
        // node ID => predecessor node ID
        var predecessors = {};

        // Costs of shortest paths from s to all nodes encountered.
        // node ID => cost
        var costs = {};
        costs[s] = 0;

        // Costs of shortest paths from s to all nodes encountered; differs from
        // `costs` in that it provides easy access to the node that currently has
        // the known shortest path from s.
        // XXX: Do we actually need both `costs` and `open`?
        var open = dijkstra.PriorityQueue.make();
        open.push(s, 0);

        var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
        while (!open.empty()) {
          // In the nodes remaining in graph that have a known cost from s,
          // find the node, u, that currently has the shortest path from s.
          closest = open.pop();
          u = closest.value;
          cost_of_s_to_u = closest.cost;

          // Get nodes adjacent to u...
          adjacent_nodes = graph[u] || {};

          // ...and explore the edges that connect u to those nodes, updating
          // the cost of the shortest paths to any or all of those nodes as
          // necessary. v is the node across the current edge from u.
          for (v in adjacent_nodes) {
            if (adjacent_nodes.hasOwnProperty(v)) {
              // Get the cost of the edge running from u to v.
              cost_of_e = adjacent_nodes[v];

              // Cost of s to u plus the cost of u to v across e--this is *a*
              // cost from s to v that may or may not be less than the current
              // known cost to v.
              cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;

              // If we haven't visited v yet OR if the current known cost from s to
              // v is greater than the new cost we just found (cost of s to u plus
              // cost of u to v across e), update v's cost in the cost list and
              // update v's predecessor in the predecessor list (it's now u).
              cost_of_s_to_v = costs[v];
              first_visit = typeof costs[v] === 'undefined';
              if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                costs[v] = cost_of_s_to_u_plus_cost_of_e;
                open.push(v, cost_of_s_to_u_plus_cost_of_e);
                predecessors[v] = u;
              }
            }
          }
        }

        if (typeof d !== 'undefined' && typeof costs[d] === 'undefined') {
          var msg = ['Could not find a path from ', s, ' to ', d, '.'].join('');
          throw new Error(msg);
        }

        return predecessors;
      },

      extract_shortest_path_from_predecessor_list: function extract_shortest_path_from_predecessor_list(predecessors, d) {
        var nodes = [];
        var u = d;
        var predecessor;
        while (u) {
          nodes.push(u);
          predecessor = predecessors[u];
          u = predecessors[u];
        }
        nodes.reverse();
        return nodes;
      },

      find_path: function find_path(graph, s, d) {
        var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
        return dijkstra.extract_shortest_path_from_predecessor_list(predecessors, d);
      },

      /**
       * A very naive priority queue implementation.
       */
      PriorityQueue: {
        make: function make(opts) {
          var T = dijkstra.PriorityQueue,
              t = {},
              key;
          opts = opts || {};
          for (key in T) {
            if (T.hasOwnProperty(key)) {
              t[key] = T[key];
            }
          }
          t.queue = [];
          t.sorter = opts.sorter || T.default_sorter;
          return t;
        },

        default_sorter: function default_sorter(a, b) {
          return a.cost - b.cost;
        },

        /**
         * Add a new item to the queue and ensure the highest priority element
         * is at the front of the queue.
         */
        push: function push(value, cost) {
          var item = { value: value, cost: cost };
          this.queue.push(item);
          this.queue.sort(this.sorter);
        },

        /**
         * Return the highest priority element in the queue.
         */
        pop: function pop() {
          return this.queue.shift();
        },

        empty: function empty() {
          return this.queue.length === 0;
        }
      }
    };

    // node.js module exports
    if (typeof module !== 'undefined') {
      module.exports = dijkstra;
    }
  }, {}], 53: [function (require, module, exports) {

    /*!
    @fileoverview gl-matrix - High performance matrix and vector operations
    @author Brandon Jones
    @author Colin MacKenzie IV
    @version 2.6.1
    
    Copyright (c) 2015-2018, Brandon Jones, Colin MacKenzie IV.
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
    
    */
    (function webpackUniversalModuleDefinition(root, factory) {
      if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && (typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object') module.exports = factory();else if (typeof define === 'function' && define.amd) define([], factory);else {
        var a = factory();
        for (var i in a) {
          ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' ? exports : root)[i] = a[i];
        }
      }
    })(typeof self !== 'undefined' ? self : this, function () {
      return (/******/function (modules) {
          // webpackBootstrap
          /******/ // The module cache
          /******/var installedModules = {};
          /******/
          /******/ // The require function
          /******/function __webpack_require__(moduleId) {
            /******/
            /******/ // Check if module is in cache
            /******/if (installedModules[moduleId]) {
              /******/return installedModules[moduleId].exports;
              /******/
            }
            /******/ // Create a new module (and put it into the cache)
            /******/var module = installedModules[moduleId] = {
              /******/i: moduleId,
              /******/l: false,
              /******/exports: {}
              /******/ };
            /******/
            /******/ // Execute the module function
            /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            /******/
            /******/ // Flag the module as loaded
            /******/module.l = true;
            /******/
            /******/ // Return the exports of the module
            /******/return module.exports;
            /******/
          }
          /******/
          /******/
          /******/ // expose the modules object (__webpack_modules__)
          /******/__webpack_require__.m = modules;
          /******/
          /******/ // expose the module cache
          /******/__webpack_require__.c = installedModules;
          /******/
          /******/ // define getter function for harmony exports
          /******/__webpack_require__.d = function (exports, name, getter) {
            /******/if (!__webpack_require__.o(exports, name)) {
              /******/Object.defineProperty(exports, name, {
                /******/configurable: false,
                /******/enumerable: true,
                /******/get: getter
                /******/ });
              /******/
            }
            /******/
          };
          /******/
          /******/ // define __esModule on exports
          /******/__webpack_require__.r = function (exports) {
            /******/Object.defineProperty(exports, '__esModule', { value: true });
            /******/
          };
          /******/
          /******/ // getDefaultExport function for compatibility with non-harmony modules
          /******/__webpack_require__.n = function (module) {
            /******/var getter = module && module.__esModule ?
            /******/function getDefault() {
              return module['default'];
            } :
            /******/function getModuleExports() {
              return module;
            };
            /******/__webpack_require__.d(getter, 'a', getter);
            /******/return getter;
            /******/
          };
          /******/
          /******/ // Object.prototype.hasOwnProperty.call
          /******/__webpack_require__.o = function (object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
          };
          /******/
          /******/ // __webpack_public_path__
          /******/__webpack_require__.p = "";
          /******/
          /******/
          /******/ // Load entry module and return exports
          /******/return __webpack_require__(__webpack_require__.s = "./src/gl-matrix.js");
          /******/
        }(
        /************************************************************************/
        /******/{

          /***/"./src/gl-matrix.js":
          /*!**************************!*\
            !*** ./src/gl-matrix.js ***!
            \**************************/
          /*! no static exports found */
          /***/function srcGlMatrixJs(module, exports, __webpack_require__) {

            "use strict";

            eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.vec4 = exports.vec3 = exports.vec2 = exports.quat2 = exports.quat = exports.mat4 = exports.mat3 = exports.mat2d = exports.mat2 = exports.glMatrix = undefined;\n\nvar _common = __webpack_require__(/*! ./gl-matrix/common.js */ \"./src/gl-matrix/common.js\");\n\nvar glMatrix = _interopRequireWildcard(_common);\n\nvar _mat = __webpack_require__(/*! ./gl-matrix/mat2.js */ \"./src/gl-matrix/mat2.js\");\n\nvar mat2 = _interopRequireWildcard(_mat);\n\nvar _mat2d = __webpack_require__(/*! ./gl-matrix/mat2d.js */ \"./src/gl-matrix/mat2d.js\");\n\nvar mat2d = _interopRequireWildcard(_mat2d);\n\nvar _mat2 = __webpack_require__(/*! ./gl-matrix/mat3.js */ \"./src/gl-matrix/mat3.js\");\n\nvar mat3 = _interopRequireWildcard(_mat2);\n\nvar _mat3 = __webpack_require__(/*! ./gl-matrix/mat4.js */ \"./src/gl-matrix/mat4.js\");\n\nvar mat4 = _interopRequireWildcard(_mat3);\n\nvar _quat = __webpack_require__(/*! ./gl-matrix/quat.js */ \"./src/gl-matrix/quat.js\");\n\nvar quat = _interopRequireWildcard(_quat);\n\nvar _quat2 = __webpack_require__(/*! ./gl-matrix/quat2.js */ \"./src/gl-matrix/quat2.js\");\n\nvar quat2 = _interopRequireWildcard(_quat2);\n\nvar _vec = __webpack_require__(/*! ./gl-matrix/vec2.js */ \"./src/gl-matrix/vec2.js\");\n\nvar vec2 = _interopRequireWildcard(_vec);\n\nvar _vec2 = __webpack_require__(/*! ./gl-matrix/vec3.js */ \"./src/gl-matrix/vec3.js\");\n\nvar vec3 = _interopRequireWildcard(_vec2);\n\nvar _vec3 = __webpack_require__(/*! ./gl-matrix/vec4.js */ \"./src/gl-matrix/vec4.js\");\n\nvar vec4 = _interopRequireWildcard(_vec3);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nexports.glMatrix = glMatrix;\nexports.mat2 = mat2;\nexports.mat2d = mat2d;\nexports.mat3 = mat3;\nexports.mat4 = mat4;\nexports.quat = quat;\nexports.quat2 = quat2;\nexports.vec2 = vec2;\nexports.vec3 = vec3;\nexports.vec4 = vec4;\n\n//# sourceURL=webpack:///./src/gl-matrix.js?");

            /***/
          },

          /***/"./src/gl-matrix/common.js":
          /*!*********************************!*\
            !*** ./src/gl-matrix/common.js ***!
            \*********************************/
          /*! no static exports found */
          /***/function srcGlMatrixCommonJs(module, exports, __webpack_require__) {

            "use strict";

            eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.setMatrixArrayType = setMatrixArrayType;\nexports.toRadian = toRadian;\nexports.equals = equals;\n/**\n * Common utilities\n * @module glMatrix\n */\n\n// Configuration Constants\nvar EPSILON = exports.EPSILON = 0.000001;\nvar ARRAY_TYPE = exports.ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;\nvar RANDOM = exports.RANDOM = Math.random;\n\n/**\n * Sets the type of array used when creating new vectors and matrices\n *\n * @param {Type} type Array type, such as Float32Array or Array\n */\nfunction setMatrixArrayType(type) {\n  exports.ARRAY_TYPE = ARRAY_TYPE = type;\n}\n\nvar degree = Math.PI / 180;\n\n/**\n * Convert Degree To Radian\n *\n * @param {Number} a Angle in Degrees\n */\nfunction toRadian(a) {\n  return a * degree;\n}\n\n/**\n * Tests whether or not the arguments have approximately the same value, within an absolute\n * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less\n * than or equal to 1.0, and a relative tolerance is used for larger values)\n *\n * @param {Number} a The first number to test.\n * @param {Number} b The second number to test.\n * @returns {Boolean} True if the numbers are approximately equal, false otherwise.\n */\nfunction equals(a, b) {\n  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));\n}\n\n//# sourceURL=webpack:///./src/gl-matrix/common.js?");

            /***/
          },

          /***/"./src/gl-matrix/mat2.js":
          /*!*******************************!*\
            !*** ./src/gl-matrix/mat2.js ***!
            \*******************************/
          /*! no static exports found */
          /***/function srcGlMatrixMat2Js(module, exports, __webpack_require__) {

            "use strict";

            eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.sub = exports.mul = undefined;\nexports.create = create;\nexports.clone = clone;\nexports.copy = copy;\nexports.identity = identity;\nexports.fromValues = fromValues;\nexports.set = set;\nexports.transpose = transpose;\nexports.invert = invert;\nexports.adjoint = adjoint;\nexports.determinant = determinant;\nexports.multiply = multiply;\nexports.rotate = rotate;\nexports.scale = scale;\nexports.fromRotation = fromRotation;\nexports.fromScaling = fromScaling;\nexports.str = str;\nexports.frob = frob;\nexports.LDU = LDU;\nexports.add = add;\nexports.subtract = subtract;\nexports.exactEquals = exactEquals;\nexports.equals = equals;\nexports.multiplyScalar = multiplyScalar;\nexports.multiplyScalarAndAdd = multiplyScalarAndAdd;\n\nvar _common = __webpack_require__(/*! ./common.js */ \"./src/gl-matrix/common.js\");\n\nvar glMatrix = _interopRequireWildcard(_common);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\n/**\n * 2x2 Matrix\n * @module mat2\n */\n\n/**\n * Creates a new identity mat2\n *\n * @returns {mat2} a new 2x2 matrix\n */\nfunction create() {\n  var out = new glMatrix.ARRAY_TYPE(4);\n  out[0] = 1;\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = 1;\n  return out;\n}\n\n/**\n * Creates a new mat2 initialized with values from an existing matrix\n *\n * @param {mat2} a matrix to clone\n * @returns {mat2} a new 2x2 matrix\n */\nfunction clone(a) {\n  var out = new glMatrix.ARRAY_TYPE(4);\n  out[0] = a[0];\n  out[1] = a[1];\n  out[2] = a[2];\n  out[3] = a[3];\n  return out;\n}\n\n/**\n * Copy the values from one mat2 to another\n *\n * @param {mat2} out the receiving matrix\n * @param {mat2} a the source matrix\n * @returns {mat2} out\n */\nfunction copy(out, a) {\n  out[0] = a[0];\n  out[1] = a[1];\n  out[2] = a[2];\n  out[3] = a[3];\n  return out;\n}\n\n/**\n * Set a mat2 to the identity matrix\n *\n * @param {mat2} out the receiving matrix\n * @returns {mat2} out\n */\nfunction identity(out) {\n  out[0] = 1;\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = 1;\n  return out;\n}\n\n/**\n * Create a new mat2 with the given values\n *\n * @param {Number} m00 Component in column 0, row 0 position (index 0)\n * @param {Number} m01 Component in column 0, row 1 position (index 1)\n * @param {Number} m10 Component in column 1, row 0 position (index 2)\n * @param {Number} m11 Component in column 1, row 1 position (index 3)\n * @returns {mat2} out A new 2x2 matrix\n */\nfunction fromValues(m00, m01, m10, m11) {\n  var out = new glMatrix.ARRAY_TYPE(4);\n  out[0] = m00;\n  out[1] = m01;\n  out[2] = m10;\n  out[3] = m11;\n  return out;\n}\n\n/**\n * Set the components of a mat2 to the given values\n *\n * @param {mat2} out the receiving matrix\n * @param {Number} m00 Component in column 0, row 0 position (index 0)\n * @param {Number} m01 Component in column 0, row 1 position (index 1)\n * @param {Number} m10 Component in column 1, row 0 position (index 2)\n * @param {Number} m11 Component in column 1, row 1 position (index 3)\n * @returns {mat2} out\n */\nfunction set(out, m00, m01, m10, m11) {\n  out[0] = m00;\n  out[1] = m01;\n  out[2] = m10;\n  out[3] = m11;\n  return out;\n}\n\n/**\n * Transpose the values of a mat2\n *\n * @param {mat2} out the receiving matrix\n * @param {mat2} a the source matrix\n * @returns {mat2} out\n */\nfunction transpose(out, a) {\n  // If we are transposing ourselves we can skip a few steps but have to cache\n  // some values\n  if (out === a) {\n    var a1 = a[1];\n    out[1] = a[2];\n    out[2] = a1;\n  } else {\n    out[0] = a[0];\n    out[1] = a[2];\n    out[2] = a[1];\n    out[3] = a[3];\n  }\n\n  return out;\n}\n\n/**\n * Inverts a mat2\n *\n * @param {mat2} out the receiving matrix\n * @param {mat2} a the source matrix\n * @returns {mat2} out\n */\nfunction invert(out, a) {\n  var a0 = a[0],\n      a1 = a[1],\n      a2 = a[2],\n      a3 = a[3];\n\n  // Calculate the determinant\n  var det = a0 * a3 - a2 * a1;\n\n  if (!det) {\n    return null;\n  }\n  det = 1.0 / det;\n\n  out[0] = a3 * det;\n  out[1] = -a1 * det;\n  out[2] = -a2 * det;\n  out[3] = a0 * det;\n\n  return out;\n}\n\n/**\n * Calculates the adjugate of a mat2\n *\n * @param {mat2} out the receiving matrix\n * @param {mat2} a the source matrix\n * @returns {mat2} out\n */\nfunction adjoint(out, a) {\n  // Caching this value is nessecary if out == a\n  var a0 = a[0];\n  out[0] = a[3];\n  out[1] = -a[1];\n  out[2] = -a[2];\n  out[3] = a0;\n\n  return out;\n}\n\n/**\n * Calculates the determinant of a mat2\n *\n * @param {mat2} a the source matrix\n * @returns {Number} determinant of a\n */\nfunction determinant(a) {\n  return a[0] * a[3] - a[2] * a[1];\n}\n\n/**\n * Multiplies two mat2's\n *\n * @param {mat2} out the receiving matrix\n * @param {mat2} a the first operand\n * @param {mat2} b the second operand\n * @returns {mat2} out\n */\nfunction multiply(out, a, b) {\n  var a0 = a[0],\n      a1 = a[1],\n      a2 = a[2],\n      a3 = a[3];\n  var b0 = b[0],\n      b1 = b[1],\n      b2 = b[2],\n      b3 = b[3];\n  out[0] = a0 * b0 + a2 * b1;\n  out[1] = a1 * b0 + a3 * b1;\n  out[2] = a0 * b2 + a2 * b3;\n  out[3] = a1 * b2 + a3 * b3;\n  return out;\n}\n\n/**\n * Rotates a mat2 by the given angle\n *\n * @param {mat2} out the receiving matrix\n * @param {mat2} a the matrix to rotate\n * @param {Number} rad the angle to rotate the matrix by\n * @returns {mat2} out\n */\nfunction rotate(out, a, rad) {\n  var a0 = a[0],\n      a1 = a[1],\n      a2 = a[2],\n      a3 = a[3];\n  var s = Math.sin(rad);\n  var c = Math.cos(rad);\n  out[0] = a0 * c + a2 * s;\n  out[1] = a1 * c + a3 * s;\n  out[2] = a0 * -s + a2 * c;\n  out[3] = a1 * -s + a3 * c;\n  return out;\n}\n\n/**\n * Scales the mat2 by the dimensions in the given vec2\n *\n * @param {mat2} out the receiving matrix\n * @param {mat2} a the matrix to rotate\n * @param {vec2} v the vec2 to scale the matrix by\n * @returns {mat2} out\n **/\nfunction scale(out, a, v) {\n  var a0 = a[0],\n      a1 = a[1],\n      a2 = a[2],\n      a3 = a[3];\n  var v0 = v[0],\n      v1 = v[1];\n  out[0] = a0 * v0;\n  out[1] = a1 * v0;\n  out[2] = a2 * v1;\n  out[3] = a3 * v1;\n  return out;\n}\n\n/**\n * Creates a matrix from a given angle\n * This is equivalent to (but much faster than):\n *\n *     mat2.identity(dest);\n *     mat2.rotate(dest, dest, rad);\n *\n * @param {mat2} out mat2 receiving operation result\n * @param {Number} rad the angle to rotate the matrix by\n * @returns {mat2} out\n */\nfunction fromRotation(out, rad) {\n  var s = Math.sin(rad);\n  var c = Math.cos(rad);\n  out[0] = c;\n  out[1] = s;\n  out[2] = -s;\n  out[3] = c;\n  return out;\n}\n\n/**\n * Creates a matrix from a vector scaling\n * This is equivalent to (but much faster than):\n *\n *     mat2.identity(dest);\n *     mat2.scale(dest, dest, vec);\n *\n * @param {mat2} out mat2 receiving operation result\n * @param {vec2} v Scaling vector\n * @returns {mat2} out\n */\nfunction fromScaling(out, v) {\n  out[0] = v[0];\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = v[1];\n  return out;\n}\n\n/**\n * Returns a string representation of a mat2\n *\n * @param {mat2} a matrix to represent as a string\n * @returns {String} string representation of the matrix\n */\nfunction str(a) {\n  return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';\n}\n\n/**\n * Returns Frobenius norm of a mat2\n *\n * @param {mat2} a the matrix to calculate Frobenius norm of\n * @returns {Number} Frobenius norm\n */\nfunction frob(a) {\n  return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2));\n}\n\n/**\n * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix\n * @param {mat2} L the lower triangular matrix\n * @param {mat2} D the diagonal matrix\n * @param {mat2} U the upper triangular matrix\n * @param {mat2} a the input matrix to factorize\n */\n\nfunction LDU(L, D, U, a) {\n  L[2] = a[2] / a[0];\n  U[0] = a[0];\n  U[1] = a[1];\n  U[3] = a[3] - L[2] * U[1];\n  return [L, D, U];\n}\n\n/**\n * Adds two mat2's\n *\n * @param {mat2} out the receiving matrix\n * @param {mat2} a the first operand\n * @param {mat2} b the second operand\n * @returns {mat2} out\n */\nfunction add(out, a, b) {\n  out[0] = a[0] + b[0];\n  out[1] = a[1] + b[1];\n  out[2] = a[2] + b[2];\n  out[3] = a[3] + b[3];\n  return out;\n}\n\n/**\n * Subtracts matrix b from matrix a\n *\n * @param {mat2} out the receiving matrix\n * @param {mat2} a the first operand\n * @param {mat2} b the second operand\n * @returns {mat2} out\n */\nfunction subtract(out, a, b) {\n  out[0] = a[0] - b[0];\n  out[1] = a[1] - b[1];\n  out[2] = a[2] - b[2];\n  out[3] = a[3] - b[3];\n  return out;\n}\n\n/**\n * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)\n *\n * @param {mat2} a The first matrix.\n * @param {mat2} b The second matrix.\n * @returns {Boolean} True if the matrices are equal, false otherwise.\n */\nfunction exactEquals(a, b) {\n  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];\n}\n\n/**\n * Returns whether or not the matrices have approximately the same elements in the same position.\n *\n * @param {mat2} a The first matrix.\n * @param {mat2} b The second matrix.\n * @returns {Boolean} True if the matrices are equal, false otherwise.\n */\nfunction equals(a, b) {\n  var a0 = a[0],\n      a1 = a[1],\n      a2 = a[2],\n      a3 = a[3];\n  var b0 = b[0],\n      b1 = b[1],\n      b2 = b[2],\n      b3 = b[3];\n  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));\n}\n\n/**\n * Multiply each element of the matrix by a scalar.\n *\n * @param {mat2} out the receiving matrix\n * @param {mat2} a the matrix to scale\n * @param {Number} b amount to scale the matrix's elements by\n * @returns {mat2} out\n */\nfunction multiplyScalar(out, a, b) {\n  out[0] = a[0] * b;\n  out[1] = a[1] * b;\n  out[2] = a[2] * b;\n  out[3] = a[3] * b;\n  return out;\n}\n\n/**\n * Adds two mat2's after multiplying each element of the second operand by a scalar value.\n *\n * @param {mat2} out the receiving vector\n * @param {mat2} a the first operand\n * @param {mat2} b the second operand\n * @param {Number} scale the amount to scale b's elements by before adding\n * @returns {mat2} out\n */\nfunction multiplyScalarAndAdd(out, a, b, scale) {\n  out[0] = a[0] + b[0] * scale;\n  out[1] = a[1] + b[1] * scale;\n  out[2] = a[2] + b[2] * scale;\n  out[3] = a[3] + b[3] * scale;\n  return out;\n}\n\n/**\n * Alias for {@link mat2.multiply}\n * @function\n */\nvar mul = exports.mul = multiply;\n\n/**\n * Alias for {@link mat2.subtract}\n * @function\n */\nvar sub = exports.sub = subtract;\n\n//# sourceURL=webpack:///./src/gl-matrix/mat2.js?");

            /***/
          },

          /***/"./src/gl-matrix/mat2d.js":
          /*!********************************!*\
            !*** ./src/gl-matrix/mat2d.js ***!
            \********************************/
          /*! no static exports found */
          /***/function srcGlMatrixMat2dJs(module, exports, __webpack_require__) {

            "use strict";

            eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.sub = exports.mul = undefined;\nexports.create = create;\nexports.clone = clone;\nexports.copy = copy;\nexports.identity = identity;\nexports.fromValues = fromValues;\nexports.set = set;\nexports.invert = invert;\nexports.determinant = determinant;\nexports.multiply = multiply;\nexports.rotate = rotate;\nexports.scale = scale;\nexports.translate = translate;\nexports.fromRotation = fromRotation;\nexports.fromScaling = fromScaling;\nexports.fromTranslation = fromTranslation;\nexports.str = str;\nexports.frob = frob;\nexports.add = add;\nexports.subtract = subtract;\nexports.multiplyScalar = multiplyScalar;\nexports.multiplyScalarAndAdd = multiplyScalarAndAdd;\nexports.exactEquals = exactEquals;\nexports.equals = equals;\n\nvar _common = __webpack_require__(/*! ./common.js */ \"./src/gl-matrix/common.js\");\n\nvar glMatrix = _interopRequireWildcard(_common);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\n/**\n * 2x3 Matrix\n * @module mat2d\n *\n * @description\n * A mat2d contains six elements defined as:\n * <pre>\n * [a, c, tx,\n *  b, d, ty]\n * </pre>\n * This is a short form for the 3x3 matrix:\n * <pre>\n * [a, c, tx,\n *  b, d, ty,\n *  0, 0, 1]\n * </pre>\n * The last row is ignored so the array is shorter and operations are faster.\n */\n\n/**\n * Creates a new identity mat2d\n *\n * @returns {mat2d} a new 2x3 matrix\n */\nfunction create() {\n  var out = new glMatrix.ARRAY_TYPE(6);\n  out[0] = 1;\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = 1;\n  out[4] = 0;\n  out[5] = 0;\n  return out;\n}\n\n/**\n * Creates a new mat2d initialized with values from an existing matrix\n *\n * @param {mat2d} a matrix to clone\n * @returns {mat2d} a new 2x3 matrix\n */\nfunction clone(a) {\n  var out = new glMatrix.ARRAY_TYPE(6);\n  out[0] = a[0];\n  out[1] = a[1];\n  out[2] = a[2];\n  out[3] = a[3];\n  out[4] = a[4];\n  out[5] = a[5];\n  return out;\n}\n\n/**\n * Copy the values from one mat2d to another\n *\n * @param {mat2d} out the receiving matrix\n * @param {mat2d} a the source matrix\n * @returns {mat2d} out\n */\nfunction copy(out, a) {\n  out[0] = a[0];\n  out[1] = a[1];\n  out[2] = a[2];\n  out[3] = a[3];\n  out[4] = a[4];\n  out[5] = a[5];\n  return out;\n}\n\n/**\n * Set a mat2d to the identity matrix\n *\n * @param {mat2d} out the receiving matrix\n * @returns {mat2d} out\n */\nfunction identity(out) {\n  out[0] = 1;\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = 1;\n  out[4] = 0;\n  out[5] = 0;\n  return out;\n}\n\n/**\n * Create a new mat2d with the given values\n *\n * @param {Number} a Component A (index 0)\n * @param {Number} b Component B (index 1)\n * @param {Number} c Component C (index 2)\n * @param {Number} d Component D (index 3)\n * @param {Number} tx Component TX (index 4)\n * @param {Number} ty Component TY (index 5)\n * @returns {mat2d} A new mat2d\n */\nfunction fromValues(a, b, c, d, tx, ty) {\n  var out = new glMatrix.ARRAY_TYPE(6);\n  out[0] = a;\n  out[1] = b;\n  out[2] = c;\n  out[3] = d;\n  out[4] = tx;\n  out[5] = ty;\n  return out;\n}\n\n/**\n * Set the components of a mat2d to the given values\n *\n * @param {mat2d} out the receiving matrix\n * @param {Number} a Component A (index 0)\n * @param {Number} b Component B (index 1)\n * @param {Number} c Component C (index 2)\n * @param {Number} d Component D (index 3)\n * @param {Number} tx Component TX (index 4)\n * @param {Number} ty Component TY (index 5)\n * @returns {mat2d} out\n */\nfunction set(out, a, b, c, d, tx, ty) {\n  out[0] = a;\n  out[1] = b;\n  out[2] = c;\n  out[3] = d;\n  out[4] = tx;\n  out[5] = ty;\n  return out;\n}\n\n/**\n * Inverts a mat2d\n *\n * @param {mat2d} out the receiving matrix\n * @param {mat2d} a the source matrix\n * @returns {mat2d} out\n */\nfunction invert(out, a) {\n  var aa = a[0],\n      ab = a[1],\n      ac = a[2],\n      ad = a[3];\n  var atx = a[4],\n      aty = a[5];\n\n  var det = aa * ad - ab * ac;\n  if (!det) {\n    return null;\n  }\n  det = 1.0 / det;\n\n  out[0] = ad * det;\n  out[1] = -ab * det;\n  out[2] = -ac * det;\n  out[3] = aa * det;\n  out[4] = (ac * aty - ad * atx) * det;\n  out[5] = (ab * atx - aa * aty) * det;\n  return out;\n}\n\n/**\n * Calculates the determinant of a mat2d\n *\n * @param {mat2d} a the source matrix\n * @returns {Number} determinant of a\n */\nfunction determinant(a) {\n  return a[0] * a[3] - a[1] * a[2];\n}\n\n/**\n * Multiplies two mat2d's\n *\n * @param {mat2d} out the receiving matrix\n * @param {mat2d} a the first operand\n * @param {mat2d} b the second operand\n * @returns {mat2d} out\n */\nfunction multiply(out, a, b) {\n  var a0 = a[0],\n      a1 = a[1],\n      a2 = a[2],\n      a3 = a[3],\n      a4 = a[4],\n      a5 = a[5];\n  var b0 = b[0],\n      b1 = b[1],\n      b2 = b[2],\n      b3 = b[3],\n      b4 = b[4],\n      b5 = b[5];\n  out[0] = a0 * b0 + a2 * b1;\n  out[1] = a1 * b0 + a3 * b1;\n  out[2] = a0 * b2 + a2 * b3;\n  out[3] = a1 * b2 + a3 * b3;\n  out[4] = a0 * b4 + a2 * b5 + a4;\n  out[5] = a1 * b4 + a3 * b5 + a5;\n  return out;\n}\n\n/**\n * Rotates a mat2d by the given angle\n *\n * @param {mat2d} out the receiving matrix\n * @param {mat2d} a the matrix to rotate\n * @param {Number} rad the angle to rotate the matrix by\n * @returns {mat2d} out\n */\nfunction rotate(out, a, rad) {\n  var a0 = a[0],\n      a1 = a[1],\n      a2 = a[2],\n      a3 = a[3],\n      a4 = a[4],\n      a5 = a[5];\n  var s = Math.sin(rad);\n  var c = Math.cos(rad);\n  out[0] = a0 * c + a2 * s;\n  out[1] = a1 * c + a3 * s;\n  out[2] = a0 * -s + a2 * c;\n  out[3] = a1 * -s + a3 * c;\n  out[4] = a4;\n  out[5] = a5;\n  return out;\n}\n\n/**\n * Scales the mat2d by the dimensions in the given vec2\n *\n * @param {mat2d} out the receiving matrix\n * @param {mat2d} a the matrix to translate\n * @param {vec2} v the vec2 to scale the matrix by\n * @returns {mat2d} out\n **/\nfunction scale(out, a, v) {\n  var a0 = a[0],\n      a1 = a[1],\n      a2 = a[2],\n      a3 = a[3],\n      a4 = a[4],\n      a5 = a[5];\n  var v0 = v[0],\n      v1 = v[1];\n  out[0] = a0 * v0;\n  out[1] = a1 * v0;\n  out[2] = a2 * v1;\n  out[3] = a3 * v1;\n  out[4] = a4;\n  out[5] = a5;\n  return out;\n}\n\n/**\n * Translates the mat2d by the dimensions in the given vec2\n *\n * @param {mat2d} out the receiving matrix\n * @param {mat2d} a the matrix to translate\n * @param {vec2} v the vec2 to translate the matrix by\n * @returns {mat2d} out\n **/\nfunction translate(out, a, v) {\n  var a0 = a[0],\n      a1 = a[1],\n      a2 = a[2],\n      a3 = a[3],\n      a4 = a[4],\n      a5 = a[5];\n  var v0 = v[0],\n      v1 = v[1];\n  out[0] = a0;\n  out[1] = a1;\n  out[2] = a2;\n  out[3] = a3;\n  out[4] = a0 * v0 + a2 * v1 + a4;\n  out[5] = a1 * v0 + a3 * v1 + a5;\n  return out;\n}\n\n/**\n * Creates a matrix from a given angle\n * This is equivalent to (but much faster than):\n *\n *     mat2d.identity(dest);\n *     mat2d.rotate(dest, dest, rad);\n *\n * @param {mat2d} out mat2d receiving operation result\n * @param {Number} rad the angle to rotate the matrix by\n * @returns {mat2d} out\n */\nfunction fromRotation(out, rad) {\n  var s = Math.sin(rad),\n      c = Math.cos(rad);\n  out[0] = c;\n  out[1] = s;\n  out[2] = -s;\n  out[3] = c;\n  out[4] = 0;\n  out[5] = 0;\n  return out;\n}\n\n/**\n * Creates a matrix from a vector scaling\n * This is equivalent to (but much faster than):\n *\n *     mat2d.identity(dest);\n *     mat2d.scale(dest, dest, vec);\n *\n * @param {mat2d} out mat2d receiving operation result\n * @param {vec2} v Scaling vector\n * @returns {mat2d} out\n */\nfunction fromScaling(out, v) {\n  out[0] = v[0];\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = v[1];\n  out[4] = 0;\n  out[5] = 0;\n  return out;\n}\n\n/**\n * Creates a matrix from a vector translation\n * This is equivalent to (but much faster than):\n *\n *     mat2d.identity(dest);\n *     mat2d.translate(dest, dest, vec);\n *\n * @param {mat2d} out mat2d receiving operation result\n * @param {vec2} v Translation vector\n * @returns {mat2d} out\n */\nfunction fromTranslation(out, v) {\n  out[0] = 1;\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = 1;\n  out[4] = v[0];\n  out[5] = v[1];\n  return out;\n}\n\n/**\n * Returns a string representation of a mat2d\n *\n * @param {mat2d} a matrix to represent as a string\n * @returns {String} string representation of the matrix\n */\nfunction str(a) {\n  return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ')';\n}\n\n/**\n * Returns Frobenius norm of a mat2d\n *\n * @param {mat2d} a the matrix to calculate Frobenius norm of\n * @returns {Number} Frobenius norm\n */\nfunction frob(a) {\n  return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1);\n}\n\n/**\n * Adds two mat2d's\n *\n * @param {mat2d} out the receiving matrix\n * @param {mat2d} a the first operand\n * @param {mat2d} b the second operand\n * @returns {mat2d} out\n */\nfunction add(out, a, b) {\n  out[0] = a[0] + b[0];\n  out[1] = a[1] + b[1];\n  out[2] = a[2] + b[2];\n  out[3] = a[3] + b[3];\n  out[4] = a[4] + b[4];\n  out[5] = a[5] + b[5];\n  return out;\n}\n\n/**\n * Subtracts matrix b from matrix a\n *\n * @param {mat2d} out the receiving matrix\n * @param {mat2d} a the first operand\n * @param {mat2d} b the second operand\n * @returns {mat2d} out\n */\nfunction subtract(out, a, b) {\n  out[0] = a[0] - b[0];\n  out[1] = a[1] - b[1];\n  out[2] = a[2] - b[2];\n  out[3] = a[3] - b[3];\n  out[4] = a[4] - b[4];\n  out[5] = a[5] - b[5];\n  return out;\n}\n\n/**\n * Multiply each element of the matrix by a scalar.\n *\n * @param {mat2d} out the receiving matrix\n * @param {mat2d} a the matrix to scale\n * @param {Number} b amount to scale the matrix's elements by\n * @returns {mat2d} out\n */\nfunction multiplyScalar(out, a, b) {\n  out[0] = a[0] * b;\n  out[1] = a[1] * b;\n  out[2] = a[2] * b;\n  out[3] = a[3] * b;\n  out[4] = a[4] * b;\n  out[5] = a[5] * b;\n  return out;\n}\n\n/**\n * Adds two mat2d's after multiplying each element of the second operand by a scalar value.\n *\n * @param {mat2d} out the receiving vector\n * @param {mat2d} a the first operand\n * @param {mat2d} b the second operand\n * @param {Number} scale the amount to scale b's elements by before adding\n * @returns {mat2d} out\n */\nfunction multiplyScalarAndAdd(out, a, b, scale) {\n  out[0] = a[0] + b[0] * scale;\n  out[1] = a[1] + b[1] * scale;\n  out[2] = a[2] + b[2] * scale;\n  out[3] = a[3] + b[3] * scale;\n  out[4] = a[4] + b[4] * scale;\n  out[5] = a[5] + b[5] * scale;\n  return out;\n}\n\n/**\n * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)\n *\n * @param {mat2d} a The first matrix.\n * @param {mat2d} b The second matrix.\n * @returns {Boolean} True if the matrices are equal, false otherwise.\n */\nfunction exactEquals(a, b) {\n  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];\n}\n\n/**\n * Returns whether or not the matrices have approximately the same elements in the same position.\n *\n * @param {mat2d} a The first matrix.\n * @param {mat2d} b The second matrix.\n * @returns {Boolean} True if the matrices are equal, false otherwise.\n */\nfunction equals(a, b) {\n  var a0 = a[0],\n      a1 = a[1],\n      a2 = a[2],\n      a3 = a[3],\n      a4 = a[4],\n      a5 = a[5];\n  var b0 = b[0],\n      b1 = b[1],\n      b2 = b[2],\n      b3 = b[3],\n      b4 = b[4],\n      b5 = b[5];\n  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5));\n}\n\n/**\n * Alias for {@link mat2d.multiply}\n * @function\n */\nvar mul = exports.mul = multiply;\n\n/**\n * Alias for {@link mat2d.subtract}\n * @function\n */\nvar sub = exports.sub = subtract;\n\n//# sourceURL=webpack:///./src/gl-matrix/mat2d.js?");

            /***/
          },

          /***/"./src/gl-matrix/mat3.js":
          /*!*******************************!*\
            !*** ./src/gl-matrix/mat3.js ***!
            \*******************************/
          /*! no static exports found */
          /***/function srcGlMatrixMat3Js(module, exports, __webpack_require__) {

            "use strict";

            eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.sub = exports.mul = undefined;\nexports.create = create;\nexports.fromMat4 = fromMat4;\nexports.clone = clone;\nexports.copy = copy;\nexports.fromValues = fromValues;\nexports.set = set;\nexports.identity = identity;\nexports.transpose = transpose;\nexports.invert = invert;\nexports.adjoint = adjoint;\nexports.determinant = determinant;\nexports.multiply = multiply;\nexports.translate = translate;\nexports.rotate = rotate;\nexports.scale = scale;\nexports.fromTranslation = fromTranslation;\nexports.fromRotation = fromRotation;\nexports.fromScaling = fromScaling;\nexports.fromMat2d = fromMat2d;\nexports.fromQuat = fromQuat;\nexports.normalFromMat4 = normalFromMat4;\nexports.projection = projection;\nexports.str = str;\nexports.frob = frob;\nexports.add = add;\nexports.subtract = subtract;\nexports.multiplyScalar = multiplyScalar;\nexports.multiplyScalarAndAdd = multiplyScalarAndAdd;\nexports.exactEquals = exactEquals;\nexports.equals = equals;\n\nvar _common = __webpack_require__(/*! ./common.js */ \"./src/gl-matrix/common.js\");\n\nvar glMatrix = _interopRequireWildcard(_common);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\n/**\n * 3x3 Matrix\n * @module mat3\n */\n\n/**\n * Creates a new identity mat3\n *\n * @returns {mat3} a new 3x3 matrix\n */\nfunction create() {\n  var out = new glMatrix.ARRAY_TYPE(9);\n  out[0] = 1;\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = 0;\n  out[4] = 1;\n  out[5] = 0;\n  out[6] = 0;\n  out[7] = 0;\n  out[8] = 1;\n  return out;\n}\n\n/**\n * Copies the upper-left 3x3 values into the given mat3.\n *\n * @param {mat3} out the receiving 3x3 matrix\n * @param {mat4} a   the source 4x4 matrix\n * @returns {mat3} out\n */\nfunction fromMat4(out, a) {\n  out[0] = a[0];\n  out[1] = a[1];\n  out[2] = a[2];\n  out[3] = a[4];\n  out[4] = a[5];\n  out[5] = a[6];\n  out[6] = a[8];\n  out[7] = a[9];\n  out[8] = a[10];\n  return out;\n}\n\n/**\n * Creates a new mat3 initialized with values from an existing matrix\n *\n * @param {mat3} a matrix to clone\n * @returns {mat3} a new 3x3 matrix\n */\nfunction clone(a) {\n  var out = new glMatrix.ARRAY_TYPE(9);\n  out[0] = a[0];\n  out[1] = a[1];\n  out[2] = a[2];\n  out[3] = a[3];\n  out[4] = a[4];\n  out[5] = a[5];\n  out[6] = a[6];\n  out[7] = a[7];\n  out[8] = a[8];\n  return out;\n}\n\n/**\n * Copy the values from one mat3 to another\n *\n * @param {mat3} out the receiving matrix\n * @param {mat3} a the source matrix\n * @returns {mat3} out\n */\nfunction copy(out, a) {\n  out[0] = a[0];\n  out[1] = a[1];\n  out[2] = a[2];\n  out[3] = a[3];\n  out[4] = a[4];\n  out[5] = a[5];\n  out[6] = a[6];\n  out[7] = a[7];\n  out[8] = a[8];\n  return out;\n}\n\n/**\n * Create a new mat3 with the given values\n *\n * @param {Number} m00 Component in column 0, row 0 position (index 0)\n * @param {Number} m01 Component in column 0, row 1 position (index 1)\n * @param {Number} m02 Component in column 0, row 2 position (index 2)\n * @param {Number} m10 Component in column 1, row 0 position (index 3)\n * @param {Number} m11 Component in column 1, row 1 position (index 4)\n * @param {Number} m12 Component in column 1, row 2 position (index 5)\n * @param {Number} m20 Component in column 2, row 0 position (index 6)\n * @param {Number} m21 Component in column 2, row 1 position (index 7)\n * @param {Number} m22 Component in column 2, row 2 position (index 8)\n * @returns {mat3} A new mat3\n */\nfunction fromValues(m00, m01, m02, m10, m11, m12, m20, m21, m22) {\n  var out = new glMatrix.ARRAY_TYPE(9);\n  out[0] = m00;\n  out[1] = m01;\n  out[2] = m02;\n  out[3] = m10;\n  out[4] = m11;\n  out[5] = m12;\n  out[6] = m20;\n  out[7] = m21;\n  out[8] = m22;\n  return out;\n}\n\n/**\n * Set the components of a mat3 to the given values\n *\n * @param {mat3} out the receiving matrix\n * @param {Number} m00 Component in column 0, row 0 position (index 0)\n * @param {Number} m01 Component in column 0, row 1 position (index 1)\n * @param {Number} m02 Component in column 0, row 2 position (index 2)\n * @param {Number} m10 Component in column 1, row 0 position (index 3)\n * @param {Number} m11 Component in column 1, row 1 position (index 4)\n * @param {Number} m12 Component in column 1, row 2 position (index 5)\n * @param {Number} m20 Component in column 2, row 0 position (index 6)\n * @param {Number} m21 Component in column 2, row 1 position (index 7)\n * @param {Number} m22 Component in column 2, row 2 position (index 8)\n * @returns {mat3} out\n */\nfunction set(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {\n  out[0] = m00;\n  out[1] = m01;\n  out[2] = m02;\n  out[3] = m10;\n  out[4] = m11;\n  out[5] = m12;\n  out[6] = m20;\n  out[7] = m21;\n  out[8] = m22;\n  return out;\n}\n\n/**\n * Set a mat3 to the identity matrix\n *\n * @param {mat3} out the receiving matrix\n * @returns {mat3} out\n */\nfunction identity(out) {\n  out[0] = 1;\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = 0;\n  out[4] = 1;\n  out[5] = 0;\n  out[6] = 0;\n  out[7] = 0;\n  out[8] = 1;\n  return out;\n}\n\n/**\n * Transpose the values of a mat3\n *\n * @param {mat3} out the receiving matrix\n * @param {mat3} a the source matrix\n * @returns {mat3} out\n */\nfunction transpose(out, a) {\n  // If we are transposing ourselves we can skip a few steps but have to cache some values\n  if (out === a) {\n    var a01 = a[1],\n        a02 = a[2],\n        a12 = a[5];\n    out[1] = a[3];\n    out[2] = a[6];\n    out[3] = a01;\n    out[5] = a[7];\n    out[6] = a02;\n    out[7] = a12;\n  } else {\n    out[0] = a[0];\n    out[1] = a[3];\n    out[2] = a[6];\n    out[3] = a[1];\n    out[4] = a[4];\n    out[5] = a[7];\n    out[6] = a[2];\n    out[7] = a[5];\n    out[8] = a[8];\n  }\n\n  return out;\n}\n\n/**\n * Inverts a mat3\n *\n * @param {mat3} out the receiving matrix\n * @param {mat3} a the source matrix\n * @returns {mat3} out\n */\nfunction invert(out, a) {\n  var a00 = a[0],\n      a01 = a[1],\n      a02 = a[2];\n  var a10 = a[3],\n      a11 = a[4],\n      a12 = a[5];\n  var a20 = a[6],\n      a21 = a[7],\n      a22 = a[8];\n\n  var b01 = a22 * a11 - a12 * a21;\n  var b11 = -a22 * a10 + a12 * a20;\n  var b21 = a21 * a10 - a11 * a20;\n\n  // Calculate the determinant\n  var det = a00 * b01 + a01 * b11 + a02 * b21;\n\n  if (!det) {\n    return null;\n  }\n  det = 1.0 / det;\n\n  out[0] = b01 * det;\n  out[1] = (-a22 * a01 + a02 * a21) * det;\n  out[2] = (a12 * a01 - a02 * a11) * det;\n  out[3] = b11 * det;\n  out[4] = (a22 * a00 - a02 * a20) * det;\n  out[5] = (-a12 * a00 + a02 * a10) * det;\n  out[6] = b21 * det;\n  out[7] = (-a21 * a00 + a01 * a20) * det;\n  out[8] = (a11 * a00 - a01 * a10) * det;\n  return out;\n}\n\n/**\n * Calculates the adjugate of a mat3\n *\n * @param {mat3} out the receiving matrix\n * @param {mat3} a the source matrix\n * @returns {mat3} out\n */\nfunction adjoint(out, a) {\n  var a00 = a[0],\n      a01 = a[1],\n      a02 = a[2];\n  var a10 = a[3],\n      a11 = a[4],\n      a12 = a[5];\n  var a20 = a[6],\n      a21 = a[7],\n      a22 = a[8];\n\n  out[0] = a11 * a22 - a12 * a21;\n  out[1] = a02 * a21 - a01 * a22;\n  out[2] = a01 * a12 - a02 * a11;\n  out[3] = a12 * a20 - a10 * a22;\n  out[4] = a00 * a22 - a02 * a20;\n  out[5] = a02 * a10 - a00 * a12;\n  out[6] = a10 * a21 - a11 * a20;\n  out[7] = a01 * a20 - a00 * a21;\n  out[8] = a00 * a11 - a01 * a10;\n  return out;\n}\n\n/**\n * Calculates the determinant of a mat3\n *\n * @param {mat3} a the source matrix\n * @returns {Number} determinant of a\n */\nfunction determinant(a) {\n  var a00 = a[0],\n      a01 = a[1],\n      a02 = a[2];\n  var a10 = a[3],\n      a11 = a[4],\n      a12 = a[5];\n  var a20 = a[6],\n      a21 = a[7],\n      a22 = a[8];\n\n  return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);\n}\n\n/**\n * Multiplies two mat3's\n *\n * @param {mat3} out the receiving matrix\n * @param {mat3} a the first operand\n * @param {mat3} b the second operand\n * @returns {mat3} out\n */\nfunction multiply(out, a, b) {\n  var a00 = a[0],\n      a01 = a[1],\n      a02 = a[2];\n  var a10 = a[3],\n      a11 = a[4],\n      a12 = a[5];\n  var a20 = a[6],\n      a21 = a[7],\n      a22 = a[8];\n\n  var b00 = b[0],\n      b01 = b[1],\n      b02 = b[2];\n  var b10 = b[3],\n      b11 = b[4],\n      b12 = b[5];\n  var b20 = b[6],\n      b21 = b[7],\n      b22 = b[8];\n\n  out[0] = b00 * a00 + b01 * a10 + b02 * a20;\n  out[1] = b00 * a01 + b01 * a11 + b02 * a21;\n  out[2] = b00 * a02 + b01 * a12 + b02 * a22;\n\n  out[3] = b10 * a00 + b11 * a10 + b12 * a20;\n  out[4] = b10 * a01 + b11 * a11 + b12 * a21;\n  out[5] = b10 * a02 + b11 * a12 + b12 * a22;\n\n  out[6] = b20 * a00 + b21 * a10 + b22 * a20;\n  out[7] = b20 * a01 + b21 * a11 + b22 * a21;\n  out[8] = b20 * a02 + b21 * a12 + b22 * a22;\n  return out;\n}\n\n/**\n * Translate a mat3 by the given vector\n *\n * @param {mat3} out the receiving matrix\n * @param {mat3} a the matrix to translate\n * @param {vec2} v vector to translate by\n * @returns {mat3} out\n */\nfunction translate(out, a, v) {\n  var a00 = a[0],\n      a01 = a[1],\n      a02 = a[2],\n      a10 = a[3],\n      a11 = a[4],\n      a12 = a[5],\n      a20 = a[6],\n      a21 = a[7],\n      a22 = a[8],\n      x = v[0],\n      y = v[1];\n\n  out[0] = a00;\n  out[1] = a01;\n  out[2] = a02;\n\n  out[3] = a10;\n  out[4] = a11;\n  out[5] = a12;\n\n  out[6] = x * a00 + y * a10 + a20;\n  out[7] = x * a01 + y * a11 + a21;\n  out[8] = x * a02 + y * a12 + a22;\n  return out;\n}\n\n/**\n * Rotates a mat3 by the given angle\n *\n * @param {mat3} out the receiving matrix\n * @param {mat3} a the matrix to rotate\n * @param {Number} rad the angle to rotate the matrix by\n * @returns {mat3} out\n */\nfunction rotate(out, a, rad) {\n  var a00 = a[0],\n      a01 = a[1],\n      a02 = a[2],\n      a10 = a[3],\n      a11 = a[4],\n      a12 = a[5],\n      a20 = a[6],\n      a21 = a[7],\n      a22 = a[8],\n      s = Math.sin(rad),\n      c = Math.cos(rad);\n\n  out[0] = c * a00 + s * a10;\n  out[1] = c * a01 + s * a11;\n  out[2] = c * a02 + s * a12;\n\n  out[3] = c * a10 - s * a00;\n  out[4] = c * a11 - s * a01;\n  out[5] = c * a12 - s * a02;\n\n  out[6] = a20;\n  out[7] = a21;\n  out[8] = a22;\n  return out;\n};\n\n/**\n * Scales the mat3 by the dimensions in the given vec2\n *\n * @param {mat3} out the receiving matrix\n * @param {mat3} a the matrix to rotate\n * @param {vec2} v the vec2 to scale the matrix by\n * @returns {mat3} out\n **/\nfunction scale(out, a, v) {\n  var x = v[0],\n      y = v[1];\n\n  out[0] = x * a[0];\n  out[1] = x * a[1];\n  out[2] = x * a[2];\n\n  out[3] = y * a[3];\n  out[4] = y * a[4];\n  out[5] = y * a[5];\n\n  out[6] = a[6];\n  out[7] = a[7];\n  out[8] = a[8];\n  return out;\n}\n\n/**\n * Creates a matrix from a vector translation\n * This is equivalent to (but much faster than):\n *\n *     mat3.identity(dest);\n *     mat3.translate(dest, dest, vec);\n *\n * @param {mat3} out mat3 receiving operation result\n * @param {vec2} v Translation vector\n * @returns {mat3} out\n */\nfunction fromTranslation(out, v) {\n  out[0] = 1;\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = 0;\n  out[4] = 1;\n  out[5] = 0;\n  out[6] = v[0];\n  out[7] = v[1];\n  out[8] = 1;\n  return out;\n}\n\n/**\n * Creates a matrix from a given angle\n * This is equivalent to (but much faster than):\n *\n *     mat3.identity(dest);\n *     mat3.rotate(dest, dest, rad);\n *\n * @param {mat3} out mat3 receiving operation result\n * @param {Number} rad the angle to rotate the matrix by\n * @returns {mat3} out\n */\nfunction fromRotation(out, rad) {\n  var s = Math.sin(rad),\n      c = Math.cos(rad);\n\n  out[0] = c;\n  out[1] = s;\n  out[2] = 0;\n\n  out[3] = -s;\n  out[4] = c;\n  out[5] = 0;\n\n  out[6] = 0;\n  out[7] = 0;\n  out[8] = 1;\n  return out;\n}\n\n/**\n * Creates a matrix from a vector scaling\n * This is equivalent to (but much faster than):\n *\n *     mat3.identity(dest);\n *     mat3.scale(dest, dest, vec);\n *\n * @param {mat3} out mat3 receiving operation result\n * @param {vec2} v Scaling vector\n * @returns {mat3} out\n */\nfunction fromScaling(out, v) {\n  out[0] = v[0];\n  out[1] = 0;\n  out[2] = 0;\n\n  out[3] = 0;\n  out[4] = v[1];\n  out[5] = 0;\n\n  out[6] = 0;\n  out[7] = 0;\n  out[8] = 1;\n  return out;\n}\n\n/**\n * Copies the values from a mat2d into a mat3\n *\n * @param {mat3} out the receiving matrix\n * @param {mat2d} a the matrix to copy\n * @returns {mat3} out\n **/\nfunction fromMat2d(out, a) {\n  out[0] = a[0];\n  out[1] = a[1];\n  out[2] = 0;\n\n  out[3] = a[2];\n  out[4] = a[3];\n  out[5] = 0;\n\n  out[6] = a[4];\n  out[7] = a[5];\n  out[8] = 1;\n  return out;\n}\n\n/**\n* Calculates a 3x3 matrix from the given quaternion\n*\n* @param {mat3} out mat3 receiving operation result\n* @param {quat} q Quaternion to create matrix from\n*\n* @returns {mat3} out\n*/\nfunction fromQuat(out, q) {\n  var x = q[0],\n      y = q[1],\n      z = q[2],\n      w = q[3];\n  var x2 = x + x;\n  var y2 = y + y;\n  var z2 = z + z;\n\n  var xx = x * x2;\n  var yx = y * x2;\n  var yy = y * y2;\n  var zx = z * x2;\n  var zy = z * y2;\n  var zz = z * z2;\n  var wx = w * x2;\n  var wy = w * y2;\n  var wz = w * z2;\n\n  out[0] = 1 - yy - zz;\n  out[3] = yx - wz;\n  out[6] = zx + wy;\n\n  out[1] = yx + wz;\n  out[4] = 1 - xx - zz;\n  out[7] = zy - wx;\n\n  out[2] = zx - wy;\n  out[5] = zy + wx;\n  out[8] = 1 - xx - yy;\n\n  return out;\n}\n\n/**\n* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix\n*\n* @param {mat3} out mat3 receiving operation result\n* @param {mat4} a Mat4 to derive the normal matrix from\n*\n* @returns {mat3} out\n*/\nfunction normalFromMat4(out, a) {\n  var a00 = a[0],\n      a01 = a[1],\n      a02 = a[2],\n      a03 = a[3];\n  var a10 = a[4],\n      a11 = a[5],\n      a12 = a[6],\n      a13 = a[7];\n  var a20 = a[8],\n      a21 = a[9],\n      a22 = a[10],\n      a23 = a[11];\n  var a30 = a[12],\n      a31 = a[13],\n      a32 = a[14],\n      a33 = a[15];\n\n  var b00 = a00 * a11 - a01 * a10;\n  var b01 = a00 * a12 - a02 * a10;\n  var b02 = a00 * a13 - a03 * a10;\n  var b03 = a01 * a12 - a02 * a11;\n  var b04 = a01 * a13 - a03 * a11;\n  var b05 = a02 * a13 - a03 * a12;\n  var b06 = a20 * a31 - a21 * a30;\n  var b07 = a20 * a32 - a22 * a30;\n  var b08 = a20 * a33 - a23 * a30;\n  var b09 = a21 * a32 - a22 * a31;\n  var b10 = a21 * a33 - a23 * a31;\n  var b11 = a22 * a33 - a23 * a32;\n\n  // Calculate the determinant\n  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n\n  if (!det) {\n    return null;\n  }\n  det = 1.0 / det;\n\n  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;\n  out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;\n  out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;\n\n  out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;\n  out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;\n  out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;\n\n  out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;\n  out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;\n  out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;\n\n  return out;\n}\n\n/**\n * Generates a 2D projection matrix with the given bounds\n *\n * @param {mat3} out mat3 frustum matrix will be written into\n * @param {number} width Width of your gl context\n * @param {number} height Height of gl context\n * @returns {mat3} out\n */\nfunction projection(out, width, height) {\n  out[0] = 2 / width;\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = 0;\n  out[4] = -2 / height;\n  out[5] = 0;\n  out[6] = -1;\n  out[7] = 1;\n  out[8] = 1;\n  return out;\n}\n\n/**\n * Returns a string representation of a mat3\n *\n * @param {mat3} a matrix to represent as a string\n * @returns {String} string representation of the matrix\n */\nfunction str(a) {\n  return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' + a[8] + ')';\n}\n\n/**\n * Returns Frobenius norm of a mat3\n *\n * @param {mat3} a the matrix to calculate Frobenius norm of\n * @returns {Number} Frobenius norm\n */\nfunction frob(a) {\n  return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2));\n}\n\n/**\n * Adds two mat3's\n *\n * @param {mat3} out the receiving matrix\n * @param {mat3} a the first operand\n * @param {mat3} b the second operand\n * @returns {mat3} out\n */\nfunction add(out, a, b) {\n  out[0] = a[0] + b[0];\n  out[1] = a[1] + b[1];\n  out[2] = a[2] + b[2];\n  out[3] = a[3] + b[3];\n  out[4] = a[4] + b[4];\n  out[5] = a[5] + b[5];\n  out[6] = a[6] + b[6];\n  out[7] = a[7] + b[7];\n  out[8] = a[8] + b[8];\n  return out;\n}\n\n/**\n * Subtracts matrix b from matrix a\n *\n * @param {mat3} out the receiving matrix\n * @param {mat3} a the first operand\n * @param {mat3} b the second operand\n * @returns {mat3} out\n */\nfunction subtract(out, a, b) {\n  out[0] = a[0] - b[0];\n  out[1] = a[1] - b[1];\n  out[2] = a[2] - b[2];\n  out[3] = a[3] - b[3];\n  out[4] = a[4] - b[4];\n  out[5] = a[5] - b[5];\n  out[6] = a[6] - b[6];\n  out[7] = a[7] - b[7];\n  out[8] = a[8] - b[8];\n  return out;\n}\n\n/**\n * Multiply each element of the matrix by a scalar.\n *\n * @param {mat3} out the receiving matrix\n * @param {mat3} a the matrix to scale\n * @param {Number} b amount to scale the matrix's elements by\n * @returns {mat3} out\n */\nfunction multiplyScalar(out, a, b) {\n  out[0] = a[0] * b;\n  out[1] = a[1] * b;\n  out[2] = a[2] * b;\n  out[3] = a[3] * b;\n  out[4] = a[4] * b;\n  out[5] = a[5] * b;\n  out[6] = a[6] * b;\n  out[7] = a[7] * b;\n  out[8] = a[8] * b;\n  return out;\n}\n\n/**\n * Adds two mat3's after multiplying each element of the second operand by a scalar value.\n *\n * @param {mat3} out the receiving vector\n * @param {mat3} a the first operand\n * @param {mat3} b the second operand\n * @param {Number} scale the amount to scale b's elements by before adding\n * @returns {mat3} out\n */\nfunction multiplyScalarAndAdd(out, a, b, scale) {\n  out[0] = a[0] + b[0] * scale;\n  out[1] = a[1] + b[1] * scale;\n  out[2] = a[2] + b[2] * scale;\n  out[3] = a[3] + b[3] * scale;\n  out[4] = a[4] + b[4] * scale;\n  out[5] = a[5] + b[5] * scale;\n  out[6] = a[6] + b[6] * scale;\n  out[7] = a[7] + b[7] * scale;\n  out[8] = a[8] + b[8] * scale;\n  return out;\n}\n\n/**\n * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)\n *\n * @param {mat3} a The first matrix.\n * @param {mat3} b The second matrix.\n * @returns {Boolean} True if the matrices are equal, false otherwise.\n */\nfunction exactEquals(a, b) {\n  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8];\n}\n\n/**\n * Returns whether or not the matrices have approximately the same elements in the same position.\n *\n * @param {mat3} a The first matrix.\n * @param {mat3} b The second matrix.\n * @returns {Boolean} True if the matrices are equal, false otherwise.\n */\nfunction equals(a, b) {\n  var a0 = a[0],\n      a1 = a[1],\n      a2 = a[2],\n      a3 = a[3],\n      a4 = a[4],\n      a5 = a[5],\n      a6 = a[6],\n      a7 = a[7],\n      a8 = a[8];\n  var b0 = b[0],\n      b1 = b[1],\n      b2 = b[2],\n      b3 = b[3],\n      b4 = b[4],\n      b5 = b[5],\n      b6 = b[6],\n      b7 = b[7],\n      b8 = b[8];\n  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8));\n}\n\n/**\n * Alias for {@link mat3.multiply}\n * @function\n */\nvar mul = exports.mul = multiply;\n\n/**\n * Alias for {@link mat3.subtract}\n * @function\n */\nvar sub = exports.sub = subtract;\n\n//# sourceURL=webpack:///./src/gl-matrix/mat3.js?");

            /***/
          },

          /***/"./src/gl-matrix/mat4.js":
          /*!*******************************!*\
            !*** ./src/gl-matrix/mat4.js ***!
            \*******************************/
          /*! no static exports found */
          /***/function srcGlMatrixMat4Js(module, exports, __webpack_require__) {

            "use strict";

            eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.sub = exports.mul = undefined;\nexports.create = create;\nexports.clone = clone;\nexports.copy = copy;\nexports.fromValues = fromValues;\nexports.set = set;\nexports.identity = identity;\nexports.transpose = transpose;\nexports.invert = invert;\nexports.adjoint = adjoint;\nexports.determinant = determinant;\nexports.multiply = multiply;\nexports.translate = translate;\nexports.scale = scale;\nexports.rotate = rotate;\nexports.rotateX = rotateX;\nexports.rotateY = rotateY;\nexports.rotateZ = rotateZ;\nexports.fromTranslation = fromTranslation;\nexports.fromScaling = fromScaling;\nexports.fromRotation = fromRotation;\nexports.fromXRotation = fromXRotation;\nexports.fromYRotation = fromYRotation;\nexports.fromZRotation = fromZRotation;\nexports.fromRotationTranslation = fromRotationTranslation;\nexports.fromQuat2 = fromQuat2;\nexports.getTranslation = getTranslation;\nexports.getScaling = getScaling;\nexports.getRotation = getRotation;\nexports.fromRotationTranslationScale = fromRotationTranslationScale;\nexports.fromRotationTranslationScaleOrigin = fromRotationTranslationScaleOrigin;\nexports.fromQuat = fromQuat;\nexports.frustum = frustum;\nexports.perspective = perspective;\nexports.perspectiveFromFieldOfView = perspectiveFromFieldOfView;\nexports.ortho = ortho;\nexports.lookAt = lookAt;\nexports.targetTo = targetTo;\nexports.str = str;\nexports.frob = frob;\nexports.add = add;\nexports.subtract = subtract;\nexports.multiplyScalar = multiplyScalar;\nexports.multiplyScalarAndAdd = multiplyScalarAndAdd;\nexports.exactEquals = exactEquals;\nexports.equals = equals;\n\nvar _common = __webpack_require__(/*! ./common.js */ \"./src/gl-matrix/common.js\");\n\nvar glMatrix = _interopRequireWildcard(_common);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\n/**\n * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.\n * @module mat4\n */\n\n/**\n * Creates a new identity mat4\n *\n * @returns {mat4} a new 4x4 matrix\n */\nfunction create() {\n  var out = new glMatrix.ARRAY_TYPE(16);\n  out[0] = 1;\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = 0;\n  out[4] = 0;\n  out[5] = 1;\n  out[6] = 0;\n  out[7] = 0;\n  out[8] = 0;\n  out[9] = 0;\n  out[10] = 1;\n  out[11] = 0;\n  out[12] = 0;\n  out[13] = 0;\n  out[14] = 0;\n  out[15] = 1;\n  return out;\n}\n\n/**\n * Creates a new mat4 initialized with values from an existing matrix\n *\n * @param {mat4} a matrix to clone\n * @returns {mat4} a new 4x4 matrix\n */\nfunction clone(a) {\n  var out = new glMatrix.ARRAY_TYPE(16);\n  out[0] = a[0];\n  out[1] = a[1];\n  out[2] = a[2];\n  out[3] = a[3];\n  out[4] = a[4];\n  out[5] = a[5];\n  out[6] = a[6];\n  out[7] = a[7];\n  out[8] = a[8];\n  out[9] = a[9];\n  out[10] = a[10];\n  out[11] = a[11];\n  out[12] = a[12];\n  out[13] = a[13];\n  out[14] = a[14];\n  out[15] = a[15];\n  return out;\n}\n\n/**\n * Copy the values from one mat4 to another\n *\n * @param {mat4} out the receiving matrix\n * @param {mat4} a the source matrix\n * @returns {mat4} out\n */\nfunction copy(out, a) {\n  out[0] = a[0];\n  out[1] = a[1];\n  out[2] = a[2];\n  out[3] = a[3];\n  out[4] = a[4];\n  out[5] = a[5];\n  out[6] = a[6];\n  out[7] = a[7];\n  out[8] = a[8];\n  out[9] = a[9];\n  out[10] = a[10];\n  out[11] = a[11];\n  out[12] = a[12];\n  out[13] = a[13];\n  out[14] = a[14];\n  out[15] = a[15];\n  return out;\n}\n\n/**\n * Create a new mat4 with the given values\n *\n * @param {Number} m00 Component in column 0, row 0 position (index 0)\n * @param {Number} m01 Component in column 0, row 1 position (index 1)\n * @param {Number} m02 Component in column 0, row 2 position (index 2)\n * @param {Number} m03 Component in column 0, row 3 position (index 3)\n * @param {Number} m10 Component in column 1, row 0 position (index 4)\n * @param {Number} m11 Component in column 1, row 1 position (index 5)\n * @param {Number} m12 Component in column 1, row 2 position (index 6)\n * @param {Number} m13 Component in column 1, row 3 position (index 7)\n * @param {Number} m20 Component in column 2, row 0 position (index 8)\n * @param {Number} m21 Component in column 2, row 1 position (index 9)\n * @param {Number} m22 Component in column 2, row 2 position (index 10)\n * @param {Number} m23 Component in column 2, row 3 position (index 11)\n * @param {Number} m30 Component in column 3, row 0 position (index 12)\n * @param {Number} m31 Component in column 3, row 1 position (index 13)\n * @param {Number} m32 Component in column 3, row 2 position (index 14)\n * @param {Number} m33 Component in column 3, row 3 position (index 15)\n * @returns {mat4} A new mat4\n */\nfunction fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {\n  var out = new glMatrix.ARRAY_TYPE(16);\n  out[0] = m00;\n  out[1] = m01;\n  out[2] = m02;\n  out[3] = m03;\n  out[4] = m10;\n  out[5] = m11;\n  out[6] = m12;\n  out[7] = m13;\n  out[8] = m20;\n  out[9] = m21;\n  out[10] = m22;\n  out[11] = m23;\n  out[12] = m30;\n  out[13] = m31;\n  out[14] = m32;\n  out[15] = m33;\n  return out;\n}\n\n/**\n * Set the components of a mat4 to the given values\n *\n * @param {mat4} out the receiving matrix\n * @param {Number} m00 Component in column 0, row 0 position (index 0)\n * @param {Number} m01 Component in column 0, row 1 position (index 1)\n * @param {Number} m02 Component in column 0, row 2 position (index 2)\n * @param {Number} m03 Component in column 0, row 3 position (index 3)\n * @param {Number} m10 Component in column 1, row 0 position (index 4)\n * @param {Number} m11 Component in column 1, row 1 position (index 5)\n * @param {Number} m12 Component in column 1, row 2 position (index 6)\n * @param {Number} m13 Component in column 1, row 3 position (index 7)\n * @param {Number} m20 Component in column 2, row 0 position (index 8)\n * @param {Number} m21 Component in column 2, row 1 position (index 9)\n * @param {Number} m22 Component in column 2, row 2 position (index 10)\n * @param {Number} m23 Component in column 2, row 3 position (index 11)\n * @param {Number} m30 Component in column 3, row 0 position (index 12)\n * @param {Number} m31 Component in column 3, row 1 position (index 13)\n * @param {Number} m32 Component in column 3, row 2 position (index 14)\n * @param {Number} m33 Component in column 3, row 3 position (index 15)\n * @returns {mat4} out\n */\nfunction set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {\n  out[0] = m00;\n  out[1] = m01;\n  out[2] = m02;\n  out[3] = m03;\n  out[4] = m10;\n  out[5] = m11;\n  out[6] = m12;\n  out[7] = m13;\n  out[8] = m20;\n  out[9] = m21;\n  out[10] = m22;\n  out[11] = m23;\n  out[12] = m30;\n  out[13] = m31;\n  out[14] = m32;\n  out[15] = m33;\n  return out;\n}\n\n/**\n * Set a mat4 to the identity matrix\n *\n * @param {mat4} out the receiving matrix\n * @returns {mat4} out\n */\nfunction identity(out) {\n  out[0] = 1;\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = 0;\n  out[4] = 0;\n  out[5] = 1;\n  out[6] = 0;\n  out[7] = 0;\n  out[8] = 0;\n  out[9] = 0;\n  out[10] = 1;\n  out[11] = 0;\n  out[12] = 0;\n  out[13] = 0;\n  out[14] = 0;\n  out[15] = 1;\n  return out;\n}\n\n/**\n * Transpose the values of a mat4\n *\n * @param {mat4} out the receiving matrix\n * @param {mat4} a the source matrix\n * @returns {mat4} out\n */\nfunction transpose(out, a) {\n  // If we are transposing ourselves we can skip a few steps but have to cache some values\n  if (out === a) {\n    var a01 = a[1],\n        a02 = a[2],\n        a03 = a[3];\n    var a12 = a[6],\n        a13 = a[7];\n    var a23 = a[11];\n\n    out[1] = a[4];\n    out[2] = a[8];\n    out[3] = a[12];\n    out[4] = a01;\n    out[6] = a[9];\n    out[7] = a[13];\n    out[8] = a02;\n    out[9] = a12;\n    out[11] = a[14];\n    out[12] = a03;\n    out[13] = a13;\n    out[14] = a23;\n  } else {\n    out[0] = a[0];\n    out[1] = a[4];\n    out[2] = a[8];\n    out[3] = a[12];\n    out[4] = a[1];\n    out[5] = a[5];\n    out[6] = a[9];\n    out[7] = a[13];\n    out[8] = a[2];\n    out[9] = a[6];\n    out[10] = a[10];\n    out[11] = a[14];\n    out[12] = a[3];\n    out[13] = a[7];\n    out[14] = a[11];\n    out[15] = a[15];\n  }\n\n  return out;\n}\n\n/**\n * Inverts a mat4\n *\n * @param {mat4} out the receiving matrix\n * @param {mat4} a the source matrix\n * @returns {mat4} out\n */\nfunction invert(out, a) {\n  var a00 = a[0],\n      a01 = a[1],\n      a02 = a[2],\n      a03 = a[3];\n  var a10 = a[4],\n      a11 = a[5],\n      a12 = a[6],\n      a13 = a[7];\n  var a20 = a[8],\n      a21 = a[9],\n      a22 = a[10],\n      a23 = a[11];\n  var a30 = a[12],\n      a31 = a[13],\n      a32 = a[14],\n      a33 = a[15];\n\n  var b00 = a00 * a11 - a01 * a10;\n  var b01 = a00 * a12 - a02 * a10;\n  var b02 = a00 * a13 - a03 * a10;\n  var b03 = a01 * a12 - a02 * a11;\n  var b04 = a01 * a13 - a03 * a11;\n  var b05 = a02 * a13 - a03 * a12;\n  var b06 = a20 * a31 - a21 * a30;\n  var b07 = a20 * a32 - a22 * a30;\n  var b08 = a20 * a33 - a23 * a30;\n  var b09 = a21 * a32 - a22 * a31;\n  var b10 = a21 * a33 - a23 * a31;\n  var b11 = a22 * a33 - a23 * a32;\n\n  // Calculate the determinant\n  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n\n  if (!det) {\n    return null;\n  }\n  det = 1.0 / det;\n\n  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;\n  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;\n  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;\n  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;\n  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;\n  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;\n  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;\n  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;\n  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;\n  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;\n  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;\n  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;\n  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;\n  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;\n  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;\n  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;\n\n  return out;\n}\n\n/**\n * Calculates the adjugate of a mat4\n *\n * @param {mat4} out the receiving matrix\n * @param {mat4} a the source matrix\n * @returns {mat4} out\n */\nfunction adjoint(out, a) {\n  var a00 = a[0],\n      a01 = a[1],\n      a02 = a[2],\n      a03 = a[3];\n  var a10 = a[4],\n      a11 = a[5],\n      a12 = a[6],\n      a13 = a[7];\n  var a20 = a[8],\n      a21 = a[9],\n      a22 = a[10],\n      a23 = a[11];\n  var a30 = a[12],\n      a31 = a[13],\n      a32 = a[14],\n      a33 = a[15];\n\n  out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);\n  out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));\n  out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);\n  out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));\n  out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));\n  out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);\n  out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));\n  out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);\n  out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);\n  out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));\n  out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);\n  out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));\n  out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));\n  out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);\n  out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));\n  out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);\n  return out;\n}\n\n/**\n * Calculates the determinant of a mat4\n *\n * @param {mat4} a the source matrix\n * @returns {Number} determinant of a\n */\nfunction determinant(a) {\n  var a00 = a[0],\n      a01 = a[1],\n      a02 = a[2],\n      a03 = a[3];\n  var a10 = a[4],\n      a11 = a[5],\n      a12 = a[6],\n      a13 = a[7];\n  var a20 = a[8],\n      a21 = a[9],\n      a22 = a[10],\n      a23 = a[11];\n  var a30 = a[12],\n      a31 = a[13],\n      a32 = a[14],\n      a33 = a[15];\n\n  var b00 = a00 * a11 - a01 * a10;\n  var b01 = a00 * a12 - a02 * a10;\n  var b02 = a00 * a13 - a03 * a10;\n  var b03 = a01 * a12 - a02 * a11;\n  var b04 = a01 * a13 - a03 * a11;\n  var b05 = a02 * a13 - a03 * a12;\n  var b06 = a20 * a31 - a21 * a30;\n  var b07 = a20 * a32 - a22 * a30;\n  var b08 = a20 * a33 - a23 * a30;\n  var b09 = a21 * a32 - a22 * a31;\n  var b10 = a21 * a33 - a23 * a31;\n  var b11 = a22 * a33 - a23 * a32;\n\n  // Calculate the determinant\n  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n}\n\n/**\n * Multiplies two mat4s\n *\n * @param {mat4} out the receiving matrix\n * @param {mat4} a the first operand\n * @param {mat4} b the second operand\n * @returns {mat4} out\n */\nfunction multiply(out, a, b) {\n  var a00 = a[0],\n      a01 = a[1],\n      a02 = a[2],\n      a03 = a[3];\n  var a10 = a[4],\n      a11 = a[5],\n      a12 = a[6],\n      a13 = a[7];\n  var a20 = a[8],\n      a21 = a[9],\n      a22 = a[10],\n      a23 = a[11];\n  var a30 = a[12],\n      a31 = a[13],\n      a32 = a[14],\n      a33 = a[15];\n\n  // Cache only the current line of the second matrix\n  var b0 = b[0],\n      b1 = b[1],\n      b2 = b[2],\n      b3 = b[3];\n  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;\n  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;\n  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;\n  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;\n\n  b0 = b[4];b1 = b[5];b2 = b[6];b3 = b[7];\n  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;\n  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;\n  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;\n  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;\n\n  b0 = b[8];b1 = b[9];b2 = b[10];b3 = b[11];\n  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;\n  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;\n  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;\n  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;\n\n  b0 = b[12];b1 = b[13];b2 = b[14];b3 = b[15];\n  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;\n  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;\n  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;\n  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;\n  return out;\n}\n\n/**\n * Translate a mat4 by the given vector\n *\n * @param {mat4} out the receiving matrix\n * @param {mat4} a the matrix to translate\n * @param {vec3} v vector to translate by\n * @returns {mat4} out\n */\nfunction translate(out, a, v) {\n  var x = v[0],\n      y = v[1],\n      z = v[2];\n  var a00 = void 0,\n      a01 = void 0,\n      a02 = void 0,\n      a03 = void 0;\n  var a10 = void 0,\n      a11 = void 0,\n      a12 = void 0,\n      a13 = void 0;\n  var a20 = void 0,\n      a21 = void 0,\n      a22 = void 0,\n      a23 = void 0;\n\n  if (a === out) {\n    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];\n    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];\n    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];\n    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];\n  } else {\n    a00 = a[0];a01 = a[1];a02 = a[2];a03 = a[3];\n    a10 = a[4];a11 = a[5];a12 = a[6];a13 = a[7];\n    a20 = a[8];a21 = a[9];a22 = a[10];a23 = a[11];\n\n    out[0] = a00;out[1] = a01;out[2] = a02;out[3] = a03;\n    out[4] = a10;out[5] = a11;out[6] = a12;out[7] = a13;\n    out[8] = a20;out[9] = a21;out[10] = a22;out[11] = a23;\n\n    out[12] = a00 * x + a10 * y + a20 * z + a[12];\n    out[13] = a01 * x + a11 * y + a21 * z + a[13];\n    out[14] = a02 * x + a12 * y + a22 * z + a[14];\n    out[15] = a03 * x + a13 * y + a23 * z + a[15];\n  }\n\n  return out;\n}\n\n/**\n * Scales the mat4 by the dimensions in the given vec3 not using vectorization\n *\n * @param {mat4} out the receiving matrix\n * @param {mat4} a the matrix to scale\n * @param {vec3} v the vec3 to scale the matrix by\n * @returns {mat4} out\n **/\nfunction scale(out, a, v) {\n  var x = v[0],\n      y = v[1],\n      z = v[2];\n\n  out[0] = a[0] * x;\n  out[1] = a[1] * x;\n  out[2] = a[2] * x;\n  out[3] = a[3] * x;\n  out[4] = a[4] * y;\n  out[5] = a[5] * y;\n  out[6] = a[6] * y;\n  out[7] = a[7] * y;\n  out[8] = a[8] * z;\n  out[9] = a[9] * z;\n  out[10] = a[10] * z;\n  out[11] = a[11] * z;\n  out[12] = a[12];\n  out[13] = a[13];\n  out[14] = a[14];\n  out[15] = a[15];\n  return out;\n}\n\n/**\n * Rotates a mat4 by the given angle around the given axis\n *\n * @param {mat4} out the receiving matrix\n * @param {mat4} a the matrix to rotate\n * @param {Number} rad the angle to rotate the matrix by\n * @param {vec3} axis the axis to rotate around\n * @returns {mat4} out\n */\nfunction rotate(out, a, rad, axis) {\n  var x = axis[0],\n      y = axis[1],\n      z = axis[2];\n  var len = Math.sqrt(x * x + y * y + z * z);\n  var s = void 0,\n      c = void 0,\n      t = void 0;\n  var a00 = void 0,\n      a01 = void 0,\n      a02 = void 0,\n      a03 = void 0;\n  var a10 = void 0,\n      a11 = void 0,\n      a12 = void 0,\n      a13 = void 0;\n  var a20 = void 0,\n      a21 = void 0,\n      a22 = void 0,\n      a23 = void 0;\n  var b00 = void 0,\n      b01 = void 0,\n      b02 = void 0;\n  var b10 = void 0,\n      b11 = void 0,\n      b12 = void 0;\n  var b20 = void 0,\n      b21 = void 0,\n      b22 = void 0;\n\n  if (len < glMatrix.EPSILON) {\n    return null;\n  }\n\n  len = 1 / len;\n  x *= len;\n  y *= len;\n  z *= len;\n\n  s = Math.sin(rad);\n  c = Math.cos(rad);\n  t = 1 - c;\n\n  a00 = a[0];a01 = a[1];a02 = a[2];a03 = a[3];\n  a10 = a[4];a11 = a[5];a12 = a[6];a13 = a[7];\n  a20 = a[8];a21 = a[9];a22 = a[10];a23 = a[11];\n\n  // Construct the elements of the rotation matrix\n  b00 = x * x * t + c;b01 = y * x * t + z * s;b02 = z * x * t - y * s;\n  b10 = x * y * t - z * s;b11 = y * y * t + c;b12 = z * y * t + x * s;\n  b20 = x * z * t + y * s;b21 = y * z * t - x * s;b22 = z * z * t + c;\n\n  // Perform rotation-specific matrix multiplication\n  out[0] = a00 * b00 + a10 * b01 + a20 * b02;\n  out[1] = a01 * b00 + a11 * b01 + a21 * b02;\n  out[2] = a02 * b00 + a12 * b01 + a22 * b02;\n  out[3] = a03 * b00 + a13 * b01 + a23 * b02;\n  out[4] = a00 * b10 + a10 * b11 + a20 * b12;\n  out[5] = a01 * b10 + a11 * b11 + a21 * b12;\n  out[6] = a02 * b10 + a12 * b11 + a22 * b12;\n  out[7] = a03 * b10 + a13 * b11 + a23 * b12;\n  out[8] = a00 * b20 + a10 * b21 + a20 * b22;\n  out[9] = a01 * b20 + a11 * b21 + a21 * b22;\n  out[10] = a02 * b20 + a12 * b21 + a22 * b22;\n  out[11] = a03 * b20 + a13 * b21 + a23 * b22;\n\n  if (a !== out) {\n    // If the source and destination differ, copy the unchanged last row\n    out[12] = a[12];\n    out[13] = a[13];\n    out[14] = a[14];\n    out[15] = a[15];\n  }\n  return out;\n}\n\n/**\n * Rotates a matrix by the given angle around the X axis\n *\n * @param {mat4} out the receiving matrix\n * @param {mat4} a the matrix to rotate\n * @param {Number} rad the angle to rotate the matrix by\n * @returns {mat4} out\n */\nfunction rotateX(out, a, rad) {\n  var s = Math.sin(rad);\n  var c = Math.cos(rad);\n  var a10 = a[4];\n  var a11 = a[5];\n  var a12 = a[6];\n  var a13 = a[7];\n  var a20 = a[8];\n  var a21 = a[9];\n  var a22 = a[10];\n  var a23 = a[11];\n\n  if (a !== out) {\n    // If the source and destination differ, copy the unchanged rows\n    out[0] = a[0];\n    out[1] = a[1];\n    out[2] = a[2];\n    out[3] = a[3];\n    out[12] = a[12];\n    out[13] = a[13];\n    out[14] = a[14];\n    out[15] = a[15];\n  }\n\n  // Perform axis-specific matrix multiplication\n  out[4] = a10 * c + a20 * s;\n  out[5] = a11 * c + a21 * s;\n  out[6] = a12 * c + a22 * s;\n  out[7] = a13 * c + a23 * s;\n  out[8] = a20 * c - a10 * s;\n  out[9] = a21 * c - a11 * s;\n  out[10] = a22 * c - a12 * s;\n  out[11] = a23 * c - a13 * s;\n  return out;\n}\n\n/**\n * Rotates a matrix by the given angle around the Y axis\n *\n * @param {mat4} out the receiving matrix\n * @param {mat4} a the matrix to rotate\n * @param {Number} rad the angle to rotate the matrix by\n * @returns {mat4} out\n */\nfunction rotateY(out, a, rad) {\n  var s = Math.sin(rad);\n  var c = Math.cos(rad);\n  var a00 = a[0];\n  var a01 = a[1];\n  var a02 = a[2];\n  var a03 = a[3];\n  var a20 = a[8];\n  var a21 = a[9];\n  var a22 = a[10];\n  var a23 = a[11];\n\n  if (a !== out) {\n    // If the source and destination differ, copy the unchanged rows\n    out[4] = a[4];\n    out[5] = a[5];\n    out[6] = a[6];\n    out[7] = a[7];\n    out[12] = a[12];\n    out[13] = a[13];\n    out[14] = a[14];\n    out[15] = a[15];\n  }\n\n  // Perform axis-specific matrix multiplication\n  out[0] = a00 * c - a20 * s;\n  out[1] = a01 * c - a21 * s;\n  out[2] = a02 * c - a22 * s;\n  out[3] = a03 * c - a23 * s;\n  out[8] = a00 * s + a20 * c;\n  out[9] = a01 * s + a21 * c;\n  out[10] = a02 * s + a22 * c;\n  out[11] = a03 * s + a23 * c;\n  return out;\n}\n\n/**\n * Rotates a matrix by the given angle around the Z axis\n *\n * @param {mat4} out the receiving matrix\n * @param {mat4} a the matrix to rotate\n * @param {Number} rad the angle to rotate the matrix by\n * @returns {mat4} out\n */\nfunction rotateZ(out, a, rad) {\n  var s = Math.sin(rad);\n  var c = Math.cos(rad);\n  var a00 = a[0];\n  var a01 = a[1];\n  var a02 = a[2];\n  var a03 = a[3];\n  var a10 = a[4];\n  var a11 = a[5];\n  var a12 = a[6];\n  var a13 = a[7];\n\n  if (a !== out) {\n    // If the source and destination differ, copy the unchanged last row\n    out[8] = a[8];\n    out[9] = a[9];\n    out[10] = a[10];\n    out[11] = a[11];\n    out[12] = a[12];\n    out[13] = a[13];\n    out[14] = a[14];\n    out[15] = a[15];\n  }\n\n  // Perform axis-specific matrix multiplication\n  out[0] = a00 * c + a10 * s;\n  out[1] = a01 * c + a11 * s;\n  out[2] = a02 * c + a12 * s;\n  out[3] = a03 * c + a13 * s;\n  out[4] = a10 * c - a00 * s;\n  out[5] = a11 * c - a01 * s;\n  out[6] = a12 * c - a02 * s;\n  out[7] = a13 * c - a03 * s;\n  return out;\n}\n\n/**\n * Creates a matrix from a vector translation\n * This is equivalent to (but much faster than):\n *\n *     mat4.identity(dest);\n *     mat4.translate(dest, dest, vec);\n *\n * @param {mat4} out mat4 receiving operation result\n * @param {vec3} v Translation vector\n * @returns {mat4} out\n */\nfunction fromTranslation(out, v) {\n  out[0] = 1;\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = 0;\n  out[4] = 0;\n  out[5] = 1;\n  out[6] = 0;\n  out[7] = 0;\n  out[8] = 0;\n  out[9] = 0;\n  out[10] = 1;\n  out[11] = 0;\n  out[12] = v[0];\n  out[13] = v[1];\n  out[14] = v[2];\n  out[15] = 1;\n  return out;\n}\n\n/**\n * Creates a matrix from a vector scaling\n * This is equivalent to (but much faster than):\n *\n *     mat4.identity(dest);\n *     mat4.scale(dest, dest, vec);\n *\n * @param {mat4} out mat4 receiving operation result\n * @param {vec3} v Scaling vector\n * @returns {mat4} out\n */\nfunction fromScaling(out, v) {\n  out[0] = v[0];\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = 0;\n  out[4] = 0;\n  out[5] = v[1];\n  out[6] = 0;\n  out[7] = 0;\n  out[8] = 0;\n  out[9] = 0;\n  out[10] = v[2];\n  out[11] = 0;\n  out[12] = 0;\n  out[13] = 0;\n  out[14] = 0;\n  out[15] = 1;\n  return out;\n}\n\n/**\n * Creates a matrix from a given angle around a given axis\n * This is equivalent to (but much faster than):\n *\n *     mat4.identity(dest);\n *     mat4.rotate(dest, dest, rad, axis);\n *\n * @param {mat4} out mat4 receiving operation result\n * @param {Number} rad the angle to rotate the matrix by\n * @param {vec3} axis the axis to rotate around\n * @returns {mat4} out\n */\nfunction fromRotation(out, rad, axis) {\n  var x = axis[0],\n      y = axis[1],\n      z = axis[2];\n  var len = Math.sqrt(x * x + y * y + z * z);\n  var s = void 0,\n      c = void 0,\n      t = void 0;\n\n  if (len < glMatrix.EPSILON) {\n    return null;\n  }\n\n  len = 1 / len;\n  x *= len;\n  y *= len;\n  z *= len;\n\n  s = Math.sin(rad);\n  c = Math.cos(rad);\n  t = 1 - c;\n\n  // Perform rotation-specific matrix multiplication\n  out[0] = x * x * t + c;\n  out[1] = y * x * t + z * s;\n  out[2] = z * x * t - y * s;\n  out[3] = 0;\n  out[4] = x * y * t - z * s;\n  out[5] = y * y * t + c;\n  out[6] = z * y * t + x * s;\n  out[7] = 0;\n  out[8] = x * z * t + y * s;\n  out[9] = y * z * t - x * s;\n  out[10] = z * z * t + c;\n  out[11] = 0;\n  out[12] = 0;\n  out[13] = 0;\n  out[14] = 0;\n  out[15] = 1;\n  return out;\n}\n\n/**\n * Creates a matrix from the given angle around the X axis\n * This is equivalent to (but much faster than):\n *\n *     mat4.identity(dest);\n *     mat4.rotateX(dest, dest, rad);\n *\n * @param {mat4} out mat4 receiving operation result\n * @param {Number} rad the angle to rotate the matrix by\n * @returns {mat4} out\n */\nfunction fromXRotation(out, rad) {\n  var s = Math.sin(rad);\n  var c = Math.cos(rad);\n\n  // Perform axis-specific matrix multiplication\n  out[0] = 1;\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = 0;\n  out[4] = 0;\n  out[5] = c;\n  out[6] = s;\n  out[7] = 0;\n  out[8] = 0;\n  out[9] = -s;\n  out[10] = c;\n  out[11] = 0;\n  out[12] = 0;\n  out[13] = 0;\n  out[14] = 0;\n  out[15] = 1;\n  return out;\n}\n\n/**\n * Creates a matrix from the given angle around the Y axis\n * This is equivalent to (but much faster than):\n *\n *     mat4.identity(dest);\n *     mat4.rotateY(dest, dest, rad);\n *\n * @param {mat4} out mat4 receiving operation result\n * @param {Number} rad the angle to rotate the matrix by\n * @returns {mat4} out\n */\nfunction fromYRotation(out, rad) {\n  var s = Math.sin(rad);\n  var c = Math.cos(rad);\n\n  // Perform axis-specific matrix multiplication\n  out[0] = c;\n  out[1] = 0;\n  out[2] = -s;\n  out[3] = 0;\n  out[4] = 0;\n  out[5] = 1;\n  out[6] = 0;\n  out[7] = 0;\n  out[8] = s;\n  out[9] = 0;\n  out[10] = c;\n  out[11] = 0;\n  out[12] = 0;\n  out[13] = 0;\n  out[14] = 0;\n  out[15] = 1;\n  return out;\n}\n\n/**\n * Creates a matrix from the given angle around the Z axis\n * This is equivalent to (but much faster than):\n *\n *     mat4.identity(dest);\n *     mat4.rotateZ(dest, dest, rad);\n *\n * @param {mat4} out mat4 receiving operation result\n * @param {Number} rad the angle to rotate the matrix by\n * @returns {mat4} out\n */\nfunction fromZRotation(out, rad) {\n  var s = Math.sin(rad);\n  var c = Math.cos(rad);\n\n  // Perform axis-specific matrix multiplication\n  out[0] = c;\n  out[1] = s;\n  out[2] = 0;\n  out[3] = 0;\n  out[4] = -s;\n  out[5] = c;\n  out[6] = 0;\n  out[7] = 0;\n  out[8] = 0;\n  out[9] = 0;\n  out[10] = 1;\n  out[11] = 0;\n  out[12] = 0;\n  out[13] = 0;\n  out[14] = 0;\n  out[15] = 1;\n  return out;\n}\n\n/**\n * Creates a matrix from a quaternion rotation and vector translation\n * This is equivalent to (but much faster than):\n *\n *     mat4.identity(dest);\n *     mat4.translate(dest, vec);\n *     let quatMat = mat4.create();\n *     quat4.toMat4(quat, quatMat);\n *     mat4.multiply(dest, quatMat);\n *\n * @param {mat4} out mat4 receiving operation result\n * @param {quat4} q Rotation quaternion\n * @param {vec3} v Translation vector\n * @returns {mat4} out\n */\nfunction fromRotationTranslation(out, q, v) {\n  // Quaternion math\n  var x = q[0],\n      y = q[1],\n      z = q[2],\n      w = q[3];\n  var x2 = x + x;\n  var y2 = y + y;\n  var z2 = z + z;\n\n  var xx = x * x2;\n  var xy = x * y2;\n  var xz = x * z2;\n  var yy = y * y2;\n  var yz = y * z2;\n  var zz = z * z2;\n  var wx = w * x2;\n  var wy = w * y2;\n  var wz = w * z2;\n\n  out[0] = 1 - (yy + zz);\n  out[1] = xy + wz;\n  out[2] = xz - wy;\n  out[3] = 0;\n  out[4] = xy - wz;\n  out[5] = 1 - (xx + zz);\n  out[6] = yz + wx;\n  out[7] = 0;\n  out[8] = xz + wy;\n  out[9] = yz - wx;\n  out[10] = 1 - (xx + yy);\n  out[11] = 0;\n  out[12] = v[0];\n  out[13] = v[1];\n  out[14] = v[2];\n  out[15] = 1;\n\n  return out;\n}\n\n/**\n * Creates a new mat4 from a dual quat.\n *\n * @param {mat4} out Matrix\n * @param {quat2} a Dual Quaternion\n * @returns {mat4} mat4 receiving operation result\n */\nfunction fromQuat2(out, a) {\n  var translation = new glMatrix.ARRAY_TYPE(3);\n  var bx = -a[0],\n      by = -a[1],\n      bz = -a[2],\n      bw = a[3],\n      ax = a[4],\n      ay = a[5],\n      az = a[6],\n      aw = a[7];\n\n  var magnitude = bx * bx + by * by + bz * bz + bw * bw;\n  //Only scale if it makes sense\n  if (magnitude > 0) {\n    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;\n    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;\n    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;\n  } else {\n    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;\n    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;\n    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;\n  }\n  fromRotationTranslation(out, a, translation);\n  return out;\n}\n\n/**\n * Returns the translation vector component of a transformation\n *  matrix. If a matrix is built with fromRotationTranslation,\n *  the returned vector will be the same as the translation vector\n *  originally supplied.\n * @param  {vec3} out Vector to receive translation component\n * @param  {mat4} mat Matrix to be decomposed (input)\n * @return {vec3} out\n */\nfunction getTranslation(out, mat) {\n  out[0] = mat[12];\n  out[1] = mat[13];\n  out[2] = mat[14];\n\n  return out;\n}\n\n/**\n * Returns the scaling factor component of a transformation\n *  matrix. If a matrix is built with fromRotationTranslationScale\n *  with a normalized Quaternion paramter, the returned vector will be\n *  the same as the scaling vector\n *  originally supplied.\n * @param  {vec3} out Vector to receive scaling factor component\n * @param  {mat4} mat Matrix to be decomposed (input)\n * @return {vec3} out\n */\nfunction getScaling(out, mat) {\n  var m11 = mat[0];\n  var m12 = mat[1];\n  var m13 = mat[2];\n  var m21 = mat[4];\n  var m22 = mat[5];\n  var m23 = mat[6];\n  var m31 = mat[8];\n  var m32 = mat[9];\n  var m33 = mat[10];\n\n  out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);\n  out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);\n  out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);\n\n  return out;\n}\n\n/**\n * Returns a quaternion representing the rotational component\n *  of a transformation matrix. If a matrix is built with\n *  fromRotationTranslation, the returned quaternion will be the\n *  same as the quaternion originally supplied.\n * @param {quat} out Quaternion to receive the rotation component\n * @param {mat4} mat Matrix to be decomposed (input)\n * @return {quat} out\n */\nfunction getRotation(out, mat) {\n  // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm\n  var trace = mat[0] + mat[5] + mat[10];\n  var S = 0;\n\n  if (trace > 0) {\n    S = Math.sqrt(trace + 1.0) * 2;\n    out[3] = 0.25 * S;\n    out[0] = (mat[6] - mat[9]) / S;\n    out[1] = (mat[8] - mat[2]) / S;\n    out[2] = (mat[1] - mat[4]) / S;\n  } else if (mat[0] > mat[5] && mat[0] > mat[10]) {\n    S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;\n    out[3] = (mat[6] - mat[9]) / S;\n    out[0] = 0.25 * S;\n    out[1] = (mat[1] + mat[4]) / S;\n    out[2] = (mat[8] + mat[2]) / S;\n  } else if (mat[5] > mat[10]) {\n    S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;\n    out[3] = (mat[8] - mat[2]) / S;\n    out[0] = (mat[1] + mat[4]) / S;\n    out[1] = 0.25 * S;\n    out[2] = (mat[6] + mat[9]) / S;\n  } else {\n    S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;\n    out[3] = (mat[1] - mat[4]) / S;\n    out[0] = (mat[8] + mat[2]) / S;\n    out[1] = (mat[6] + mat[9]) / S;\n    out[2] = 0.25 * S;\n  }\n\n  return out;\n}\n\n/**\n * Creates a matrix from a quaternion rotation, vector translation and vector scale\n * This is equivalent to (but much faster than):\n *\n *     mat4.identity(dest);\n *     mat4.translate(dest, vec);\n *     let quatMat = mat4.create();\n *     quat4.toMat4(quat, quatMat);\n *     mat4.multiply(dest, quatMat);\n *     mat4.scale(dest, scale)\n *\n * @param {mat4} out mat4 receiving operation result\n * @param {quat4} q Rotation quaternion\n * @param {vec3} v Translation vector\n * @param {vec3} s Scaling vector\n * @returns {mat4} out\n */\nfunction fromRotationTranslationScale(out, q, v, s) {\n  // Quaternion math\n  var x = q[0],\n      y = q[1],\n      z = q[2],\n      w = q[3];\n  var x2 = x + x;\n  var y2 = y + y;\n  var z2 = z + z;\n\n  var xx = x * x2;\n  var xy = x * y2;\n  var xz = x * z2;\n  var yy = y * y2;\n  var yz = y * z2;\n  var zz = z * z2;\n  var wx = w * x2;\n  var wy = w * y2;\n  var wz = w * z2;\n  var sx = s[0];\n  var sy = s[1];\n  var sz = s[2];\n\n  out[0] = (1 - (yy + zz)) * sx;\n  out[1] = (xy + wz) * sx;\n  out[2] = (xz - wy) * sx;\n  out[3] = 0;\n  out[4] = (xy - wz) * sy;\n  out[5] = (1 - (xx + zz)) * sy;\n  out[6] = (yz + wx) * sy;\n  out[7] = 0;\n  out[8] = (xz + wy) * sz;\n  out[9] = (yz - wx) * sz;\n  out[10] = (1 - (xx + yy)) * sz;\n  out[11] = 0;\n  out[12] = v[0];\n  out[13] = v[1];\n  out[14] = v[2];\n  out[15] = 1;\n\n  return out;\n}\n\n/**\n * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin\n * This is equivalent to (but much faster than):\n *\n *     mat4.identity(dest);\n *     mat4.translate(dest, vec);\n *     mat4.translate(dest, origin);\n *     let quatMat = mat4.create();\n *     quat4.toMat4(quat, quatMat);\n *     mat4.multiply(dest, quatMat);\n *     mat4.scale(dest, scale)\n *     mat4.translate(dest, negativeOrigin);\n *\n * @param {mat4} out mat4 receiving operation result\n * @param {quat4} q Rotation quaternion\n * @param {vec3} v Translation vector\n * @param {vec3} s Scaling vector\n * @param {vec3} o The origin vector around which to scale and rotate\n * @returns {mat4} out\n */\nfunction fromRotationTranslationScaleOrigin(out, q, v, s, o) {\n  // Quaternion math\n  var x = q[0],\n      y = q[1],\n      z = q[2],\n      w = q[3];\n  var x2 = x + x;\n  var y2 = y + y;\n  var z2 = z + z;\n\n  var xx = x * x2;\n  var xy = x * y2;\n  var xz = x * z2;\n  var yy = y * y2;\n  var yz = y * z2;\n  var zz = z * z2;\n  var wx = w * x2;\n  var wy = w * y2;\n  var wz = w * z2;\n\n  var sx = s[0];\n  var sy = s[1];\n  var sz = s[2];\n\n  var ox = o[0];\n  var oy = o[1];\n  var oz = o[2];\n\n  var out0 = (1 - (yy + zz)) * sx;\n  var out1 = (xy + wz) * sx;\n  var out2 = (xz - wy) * sx;\n  var out4 = (xy - wz) * sy;\n  var out5 = (1 - (xx + zz)) * sy;\n  var out6 = (yz + wx) * sy;\n  var out8 = (xz + wy) * sz;\n  var out9 = (yz - wx) * sz;\n  var out10 = (1 - (xx + yy)) * sz;\n\n  out[0] = out0;\n  out[1] = out1;\n  out[2] = out2;\n  out[3] = 0;\n  out[4] = out4;\n  out[5] = out5;\n  out[6] = out6;\n  out[7] = 0;\n  out[8] = out8;\n  out[9] = out9;\n  out[10] = out10;\n  out[11] = 0;\n  out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);\n  out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);\n  out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);\n  out[15] = 1;\n\n  return out;\n}\n\n/**\n * Calculates a 4x4 matrix from the given quaternion\n *\n * @param {mat4} out mat4 receiving operation result\n * @param {quat} q Quaternion to create matrix from\n *\n * @returns {mat4} out\n */\nfunction fromQuat(out, q) {\n  var x = q[0],\n      y = q[1],\n      z = q[2],\n      w = q[3];\n  var x2 = x + x;\n  var y2 = y + y;\n  var z2 = z + z;\n\n  var xx = x * x2;\n  var yx = y * x2;\n  var yy = y * y2;\n  var zx = z * x2;\n  var zy = z * y2;\n  var zz = z * z2;\n  var wx = w * x2;\n  var wy = w * y2;\n  var wz = w * z2;\n\n  out[0] = 1 - yy - zz;\n  out[1] = yx + wz;\n  out[2] = zx - wy;\n  out[3] = 0;\n\n  out[4] = yx - wz;\n  out[5] = 1 - xx - zz;\n  out[6] = zy + wx;\n  out[7] = 0;\n\n  out[8] = zx + wy;\n  out[9] = zy - wx;\n  out[10] = 1 - xx - yy;\n  out[11] = 0;\n\n  out[12] = 0;\n  out[13] = 0;\n  out[14] = 0;\n  out[15] = 1;\n\n  return out;\n}\n\n/**\n * Generates a frustum matrix with the given bounds\n *\n * @param {mat4} out mat4 frustum matrix will be written into\n * @param {Number} left Left bound of the frustum\n * @param {Number} right Right bound of the frustum\n * @param {Number} bottom Bottom bound of the frustum\n * @param {Number} top Top bound of the frustum\n * @param {Number} near Near bound of the frustum\n * @param {Number} far Far bound of the frustum\n * @returns {mat4} out\n */\nfunction frustum(out, left, right, bottom, top, near, far) {\n  var rl = 1 / (right - left);\n  var tb = 1 / (top - bottom);\n  var nf = 1 / (near - far);\n  out[0] = near * 2 * rl;\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = 0;\n  out[4] = 0;\n  out[5] = near * 2 * tb;\n  out[6] = 0;\n  out[7] = 0;\n  out[8] = (right + left) * rl;\n  out[9] = (top + bottom) * tb;\n  out[10] = (far + near) * nf;\n  out[11] = -1;\n  out[12] = 0;\n  out[13] = 0;\n  out[14] = far * near * 2 * nf;\n  out[15] = 0;\n  return out;\n}\n\n/**\n * Generates a perspective projection matrix with the given bounds\n *\n * @param {mat4} out mat4 frustum matrix will be written into\n * @param {number} fovy Vertical field of view in radians\n * @param {number} aspect Aspect ratio. typically viewport width/height\n * @param {number} near Near bound of the frustum\n * @param {number} far Far bound of the frustum\n * @returns {mat4} out\n */\nfunction perspective(out, fovy, aspect, near, far) {\n  var f = 1.0 / Math.tan(fovy / 2);\n  var nf = 1 / (near - far);\n  out[0] = f / aspect;\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = 0;\n  out[4] = 0;\n  out[5] = f;\n  out[6] = 0;\n  out[7] = 0;\n  out[8] = 0;\n  out[9] = 0;\n  out[10] = (far + near) * nf;\n  out[11] = -1;\n  out[12] = 0;\n  out[13] = 0;\n  out[14] = 2 * far * near * nf;\n  out[15] = 0;\n  return out;\n}\n\n/**\n * Generates a perspective projection matrix with the given field of view.\n * This is primarily useful for generating projection matrices to be used\n * with the still experiemental WebVR API.\n *\n * @param {mat4} out mat4 frustum matrix will be written into\n * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees\n * @param {number} near Near bound of the frustum\n * @param {number} far Far bound of the frustum\n * @returns {mat4} out\n */\nfunction perspectiveFromFieldOfView(out, fov, near, far) {\n  var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);\n  var downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);\n  var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);\n  var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);\n  var xScale = 2.0 / (leftTan + rightTan);\n  var yScale = 2.0 / (upTan + downTan);\n\n  out[0] = xScale;\n  out[1] = 0.0;\n  out[2] = 0.0;\n  out[3] = 0.0;\n  out[4] = 0.0;\n  out[5] = yScale;\n  out[6] = 0.0;\n  out[7] = 0.0;\n  out[8] = -((leftTan - rightTan) * xScale * 0.5);\n  out[9] = (upTan - downTan) * yScale * 0.5;\n  out[10] = far / (near - far);\n  out[11] = -1.0;\n  out[12] = 0.0;\n  out[13] = 0.0;\n  out[14] = far * near / (near - far);\n  out[15] = 0.0;\n  return out;\n}\n\n/**\n * Generates a orthogonal projection matrix with the given bounds\n *\n * @param {mat4} out mat4 frustum matrix will be written into\n * @param {number} left Left bound of the frustum\n * @param {number} right Right bound of the frustum\n * @param {number} bottom Bottom bound of the frustum\n * @param {number} top Top bound of the frustum\n * @param {number} near Near bound of the frustum\n * @param {number} far Far bound of the frustum\n * @returns {mat4} out\n */\nfunction ortho(out, left, right, bottom, top, near, far) {\n  var lr = 1 / (left - right);\n  var bt = 1 / (bottom - top);\n  var nf = 1 / (near - far);\n  out[0] = -2 * lr;\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = 0;\n  out[4] = 0;\n  out[5] = -2 * bt;\n  out[6] = 0;\n  out[7] = 0;\n  out[8] = 0;\n  out[9] = 0;\n  out[10] = 2 * nf;\n  out[11] = 0;\n  out[12] = (left + right) * lr;\n  out[13] = (top + bottom) * bt;\n  out[14] = (far + near) * nf;\n  out[15] = 1;\n  return out;\n}\n\n/**\n * Generates a look-at matrix with the given eye position, focal point, and up axis.\n * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.\n *\n * @param {mat4} out mat4 frustum matrix will be written into\n * @param {vec3} eye Position of the viewer\n * @param {vec3} center Point the viewer is looking at\n * @param {vec3} up vec3 pointing up\n * @returns {mat4} out\n */\nfunction lookAt(out, eye, center, up) {\n  var x0 = void 0,\n      x1 = void 0,\n      x2 = void 0,\n      y0 = void 0,\n      y1 = void 0,\n      y2 = void 0,\n      z0 = void 0,\n      z1 = void 0,\n      z2 = void 0,\n      len = void 0;\n  var eyex = eye[0];\n  var eyey = eye[1];\n  var eyez = eye[2];\n  var upx = up[0];\n  var upy = up[1];\n  var upz = up[2];\n  var centerx = center[0];\n  var centery = center[1];\n  var centerz = center[2];\n\n  if (Math.abs(eyex - centerx) < glMatrix.EPSILON && Math.abs(eyey - centery) < glMatrix.EPSILON && Math.abs(eyez - centerz) < glMatrix.EPSILON) {\n    return identity(out);\n  }\n\n  z0 = eyex - centerx;\n  z1 = eyey - centery;\n  z2 = eyez - centerz;\n\n  len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);\n  z0 *= len;\n  z1 *= len;\n  z2 *= len;\n\n  x0 = upy * z2 - upz * z1;\n  x1 = upz * z0 - upx * z2;\n  x2 = upx * z1 - upy * z0;\n  len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);\n  if (!len) {\n    x0 = 0;\n    x1 = 0;\n    x2 = 0;\n  } else {\n    len = 1 / len;\n    x0 *= len;\n    x1 *= len;\n    x2 *= len;\n  }\n\n  y0 = z1 * x2 - z2 * x1;\n  y1 = z2 * x0 - z0 * x2;\n  y2 = z0 * x1 - z1 * x0;\n\n  len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);\n  if (!len) {\n    y0 = 0;\n    y1 = 0;\n    y2 = 0;\n  } else {\n    len = 1 / len;\n    y0 *= len;\n    y1 *= len;\n    y2 *= len;\n  }\n\n  out[0] = x0;\n  out[1] = y0;\n  out[2] = z0;\n  out[3] = 0;\n  out[4] = x1;\n  out[5] = y1;\n  out[6] = z1;\n  out[7] = 0;\n  out[8] = x2;\n  out[9] = y2;\n  out[10] = z2;\n  out[11] = 0;\n  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);\n  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);\n  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);\n  out[15] = 1;\n\n  return out;\n}\n\n/**\n * Generates a matrix that makes something look at something else.\n *\n * @param {mat4} out mat4 frustum matrix will be written into\n * @param {vec3} eye Position of the viewer\n * @param {vec3} center Point the viewer is looking at\n * @param {vec3} up vec3 pointing up\n * @returns {mat4} out\n */\nfunction targetTo(out, eye, target, up) {\n  var eyex = eye[0],\n      eyey = eye[1],\n      eyez = eye[2],\n      upx = up[0],\n      upy = up[1],\n      upz = up[2];\n\n  var z0 = eyex - target[0],\n      z1 = eyey - target[1],\n      z2 = eyez - target[2];\n\n  var len = z0 * z0 + z1 * z1 + z2 * z2;\n  if (len > 0) {\n    len = 1 / Math.sqrt(len);\n    z0 *= len;\n    z1 *= len;\n    z2 *= len;\n  }\n\n  var x0 = upy * z2 - upz * z1,\n      x1 = upz * z0 - upx * z2,\n      x2 = upx * z1 - upy * z0;\n\n  len = x0 * x0 + x1 * x1 + x2 * x2;\n  if (len > 0) {\n    len = 1 / Math.sqrt(len);\n    x0 *= len;\n    x1 *= len;\n    x2 *= len;\n  }\n\n  out[0] = x0;\n  out[1] = x1;\n  out[2] = x2;\n  out[3] = 0;\n  out[4] = z1 * x2 - z2 * x1;\n  out[5] = z2 * x0 - z0 * x2;\n  out[6] = z0 * x1 - z1 * x0;\n  out[7] = 0;\n  out[8] = z0;\n  out[9] = z1;\n  out[10] = z2;\n  out[11] = 0;\n  out[12] = eyex;\n  out[13] = eyey;\n  out[14] = eyez;\n  out[15] = 1;\n  return out;\n};\n\n/**\n * Returns a string representation of a mat4\n *\n * @param {mat4} a matrix to represent as a string\n * @returns {String} string representation of the matrix\n */\nfunction str(a) {\n  return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' + a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';\n}\n\n/**\n * Returns Frobenius norm of a mat4\n *\n * @param {mat4} a the matrix to calculate Frobenius norm of\n * @returns {Number} Frobenius norm\n */\nfunction frob(a) {\n  return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2));\n}\n\n/**\n * Adds two mat4's\n *\n * @param {mat4} out the receiving matrix\n * @param {mat4} a the first operand\n * @param {mat4} b the second operand\n * @returns {mat4} out\n */\nfunction add(out, a, b) {\n  out[0] = a[0] + b[0];\n  out[1] = a[1] + b[1];\n  out[2] = a[2] + b[2];\n  out[3] = a[3] + b[3];\n  out[4] = a[4] + b[4];\n  out[5] = a[5] + b[5];\n  out[6] = a[6] + b[6];\n  out[7] = a[7] + b[7];\n  out[8] = a[8] + b[8];\n  out[9] = a[9] + b[9];\n  out[10] = a[10] + b[10];\n  out[11] = a[11] + b[11];\n  out[12] = a[12] + b[12];\n  out[13] = a[13] + b[13];\n  out[14] = a[14] + b[14];\n  out[15] = a[15] + b[15];\n  return out;\n}\n\n/**\n * Subtracts matrix b from matrix a\n *\n * @param {mat4} out the receiving matrix\n * @param {mat4} a the first operand\n * @param {mat4} b the second operand\n * @returns {mat4} out\n */\nfunction subtract(out, a, b) {\n  out[0] = a[0] - b[0];\n  out[1] = a[1] - b[1];\n  out[2] = a[2] - b[2];\n  out[3] = a[3] - b[3];\n  out[4] = a[4] - b[4];\n  out[5] = a[5] - b[5];\n  out[6] = a[6] - b[6];\n  out[7] = a[7] - b[7];\n  out[8] = a[8] - b[8];\n  out[9] = a[9] - b[9];\n  out[10] = a[10] - b[10];\n  out[11] = a[11] - b[11];\n  out[12] = a[12] - b[12];\n  out[13] = a[13] - b[13];\n  out[14] = a[14] - b[14];\n  out[15] = a[15] - b[15];\n  return out;\n}\n\n/**\n * Multiply each element of the matrix by a scalar.\n *\n * @param {mat4} out the receiving matrix\n * @param {mat4} a the matrix to scale\n * @param {Number} b amount to scale the matrix's elements by\n * @returns {mat4} out\n */\nfunction multiplyScalar(out, a, b) {\n  out[0] = a[0] * b;\n  out[1] = a[1] * b;\n  out[2] = a[2] * b;\n  out[3] = a[3] * b;\n  out[4] = a[4] * b;\n  out[5] = a[5] * b;\n  out[6] = a[6] * b;\n  out[7] = a[7] * b;\n  out[8] = a[8] * b;\n  out[9] = a[9] * b;\n  out[10] = a[10] * b;\n  out[11] = a[11] * b;\n  out[12] = a[12] * b;\n  out[13] = a[13] * b;\n  out[14] = a[14] * b;\n  out[15] = a[15] * b;\n  return out;\n}\n\n/**\n * Adds two mat4's after multiplying each element of the second operand by a scalar value.\n *\n * @param {mat4} out the receiving vector\n * @param {mat4} a the first operand\n * @param {mat4} b the second operand\n * @param {Number} scale the amount to scale b's elements by before adding\n * @returns {mat4} out\n */\nfunction multiplyScalarAndAdd(out, a, b, scale) {\n  out[0] = a[0] + b[0] * scale;\n  out[1] = a[1] + b[1] * scale;\n  out[2] = a[2] + b[2] * scale;\n  out[3] = a[3] + b[3] * scale;\n  out[4] = a[4] + b[4] * scale;\n  out[5] = a[5] + b[5] * scale;\n  out[6] = a[6] + b[6] * scale;\n  out[7] = a[7] + b[7] * scale;\n  out[8] = a[8] + b[8] * scale;\n  out[9] = a[9] + b[9] * scale;\n  out[10] = a[10] + b[10] * scale;\n  out[11] = a[11] + b[11] * scale;\n  out[12] = a[12] + b[12] * scale;\n  out[13] = a[13] + b[13] * scale;\n  out[14] = a[14] + b[14] * scale;\n  out[15] = a[15] + b[15] * scale;\n  return out;\n}\n\n/**\n * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)\n *\n * @param {mat4} a The first matrix.\n * @param {mat4} b The second matrix.\n * @returns {Boolean} True if the matrices are equal, false otherwise.\n */\nfunction exactEquals(a, b) {\n  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];\n}\n\n/**\n * Returns whether or not the matrices have approximately the same elements in the same position.\n *\n * @param {mat4} a The first matrix.\n * @param {mat4} b The second matrix.\n * @returns {Boolean} True if the matrices are equal, false otherwise.\n */\nfunction equals(a, b) {\n  var a0 = a[0],\n      a1 = a[1],\n      a2 = a[2],\n      a3 = a[3];\n  var a4 = a[4],\n      a5 = a[5],\n      a6 = a[6],\n      a7 = a[7];\n  var a8 = a[8],\n      a9 = a[9],\n      a10 = a[10],\n      a11 = a[11];\n  var a12 = a[12],\n      a13 = a[13],\n      a14 = a[14],\n      a15 = a[15];\n\n  var b0 = b[0],\n      b1 = b[1],\n      b2 = b[2],\n      b3 = b[3];\n  var b4 = b[4],\n      b5 = b[5],\n      b6 = b[6],\n      b7 = b[7];\n  var b8 = b[8],\n      b9 = b[9],\n      b10 = b[10],\n      b11 = b[11];\n  var b12 = b[12],\n      b13 = b[13],\n      b14 = b[14],\n      b15 = b[15];\n\n  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15));\n}\n\n/**\n * Alias for {@link mat4.multiply}\n * @function\n */\nvar mul = exports.mul = multiply;\n\n/**\n * Alias for {@link mat4.subtract}\n * @function\n */\nvar sub = exports.sub = subtract;\n\n//# sourceURL=webpack:///./src/gl-matrix/mat4.js?");

            /***/
          },

          /***/"./src/gl-matrix/quat.js":
          /*!*******************************!*\
            !*** ./src/gl-matrix/quat.js ***!
            \*******************************/
          /*! no static exports found */
          /***/function srcGlMatrixQuatJs(module, exports, __webpack_require__) {

            "use strict";

            eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.setAxes = exports.sqlerp = exports.rotationTo = exports.equals = exports.exactEquals = exports.normalize = exports.sqrLen = exports.squaredLength = exports.len = exports.length = exports.lerp = exports.dot = exports.scale = exports.mul = exports.add = exports.set = exports.copy = exports.fromValues = exports.clone = undefined;\nexports.create = create;\nexports.identity = identity;\nexports.setAxisAngle = setAxisAngle;\nexports.getAxisAngle = getAxisAngle;\nexports.multiply = multiply;\nexports.rotateX = rotateX;\nexports.rotateY = rotateY;\nexports.rotateZ = rotateZ;\nexports.calculateW = calculateW;\nexports.slerp = slerp;\nexports.invert = invert;\nexports.conjugate = conjugate;\nexports.fromMat3 = fromMat3;\nexports.fromEuler = fromEuler;\nexports.str = str;\n\nvar _common = __webpack_require__(/*! ./common.js */ \"./src/gl-matrix/common.js\");\n\nvar glMatrix = _interopRequireWildcard(_common);\n\nvar _mat = __webpack_require__(/*! ./mat3.js */ \"./src/gl-matrix/mat3.js\");\n\nvar mat3 = _interopRequireWildcard(_mat);\n\nvar _vec = __webpack_require__(/*! ./vec3.js */ \"./src/gl-matrix/vec3.js\");\n\nvar vec3 = _interopRequireWildcard(_vec);\n\nvar _vec2 = __webpack_require__(/*! ./vec4.js */ \"./src/gl-matrix/vec4.js\");\n\nvar vec4 = _interopRequireWildcard(_vec2);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\n/**\n * Quaternion\n * @module quat\n */\n\n/**\n * Creates a new identity quat\n *\n * @returns {quat} a new quaternion\n */\nfunction create() {\n  var out = new glMatrix.ARRAY_TYPE(4);\n  out[0] = 0;\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = 1;\n  return out;\n}\n\n/**\n * Set a quat to the identity quaternion\n *\n * @param {quat} out the receiving quaternion\n * @returns {quat} out\n */\nfunction identity(out) {\n  out[0] = 0;\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = 1;\n  return out;\n}\n\n/**\n * Sets a quat from the given angle and rotation axis,\n * then returns it.\n *\n * @param {quat} out the receiving quaternion\n * @param {vec3} axis the axis around which to rotate\n * @param {Number} rad the angle in radians\n * @returns {quat} out\n **/\nfunction setAxisAngle(out, axis, rad) {\n  rad = rad * 0.5;\n  var s = Math.sin(rad);\n  out[0] = s * axis[0];\n  out[1] = s * axis[1];\n  out[2] = s * axis[2];\n  out[3] = Math.cos(rad);\n  return out;\n}\n\n/**\n * Gets the rotation axis and angle for a given\n *  quaternion. If a quaternion is created with\n *  setAxisAngle, this method will return the same\n *  values as providied in the original parameter list\n *  OR functionally equivalent values.\n * Example: The quaternion formed by axis [0, 0, 1] and\n *  angle -90 is the same as the quaternion formed by\n *  [0, 0, 1] and 270. This method favors the latter.\n * @param  {vec3} out_axis  Vector receiving the axis of rotation\n * @param  {quat} q     Quaternion to be decomposed\n * @return {Number}     Angle, in radians, of the rotation\n */\nfunction getAxisAngle(out_axis, q) {\n  var rad = Math.acos(q[3]) * 2.0;\n  var s = Math.sin(rad / 2.0);\n  if (s != 0.0) {\n    out_axis[0] = q[0] / s;\n    out_axis[1] = q[1] / s;\n    out_axis[2] = q[2] / s;\n  } else {\n    // If s is zero, return any axis (no rotation - axis does not matter)\n    out_axis[0] = 1;\n    out_axis[1] = 0;\n    out_axis[2] = 0;\n  }\n  return rad;\n}\n\n/**\n * Multiplies two quat's\n *\n * @param {quat} out the receiving quaternion\n * @param {quat} a the first operand\n * @param {quat} b the second operand\n * @returns {quat} out\n */\nfunction multiply(out, a, b) {\n  var ax = a[0],\n      ay = a[1],\n      az = a[2],\n      aw = a[3];\n  var bx = b[0],\n      by = b[1],\n      bz = b[2],\n      bw = b[3];\n\n  out[0] = ax * bw + aw * bx + ay * bz - az * by;\n  out[1] = ay * bw + aw * by + az * bx - ax * bz;\n  out[2] = az * bw + aw * bz + ax * by - ay * bx;\n  out[3] = aw * bw - ax * bx - ay * by - az * bz;\n  return out;\n}\n\n/**\n * Rotates a quaternion by the given angle about the X axis\n *\n * @param {quat} out quat receiving operation result\n * @param {quat} a quat to rotate\n * @param {number} rad angle (in radians) to rotate\n * @returns {quat} out\n */\nfunction rotateX(out, a, rad) {\n  rad *= 0.5;\n\n  var ax = a[0],\n      ay = a[1],\n      az = a[2],\n      aw = a[3];\n  var bx = Math.sin(rad),\n      bw = Math.cos(rad);\n\n  out[0] = ax * bw + aw * bx;\n  out[1] = ay * bw + az * bx;\n  out[2] = az * bw - ay * bx;\n  out[3] = aw * bw - ax * bx;\n  return out;\n}\n\n/**\n * Rotates a quaternion by the given angle about the Y axis\n *\n * @param {quat} out quat receiving operation result\n * @param {quat} a quat to rotate\n * @param {number} rad angle (in radians) to rotate\n * @returns {quat} out\n */\nfunction rotateY(out, a, rad) {\n  rad *= 0.5;\n\n  var ax = a[0],\n      ay = a[1],\n      az = a[2],\n      aw = a[3];\n  var by = Math.sin(rad),\n      bw = Math.cos(rad);\n\n  out[0] = ax * bw - az * by;\n  out[1] = ay * bw + aw * by;\n  out[2] = az * bw + ax * by;\n  out[3] = aw * bw - ay * by;\n  return out;\n}\n\n/**\n * Rotates a quaternion by the given angle about the Z axis\n *\n * @param {quat} out quat receiving operation result\n * @param {quat} a quat to rotate\n * @param {number} rad angle (in radians) to rotate\n * @returns {quat} out\n */\nfunction rotateZ(out, a, rad) {\n  rad *= 0.5;\n\n  var ax = a[0],\n      ay = a[1],\n      az = a[2],\n      aw = a[3];\n  var bz = Math.sin(rad),\n      bw = Math.cos(rad);\n\n  out[0] = ax * bw + ay * bz;\n  out[1] = ay * bw - ax * bz;\n  out[2] = az * bw + aw * bz;\n  out[3] = aw * bw - az * bz;\n  return out;\n}\n\n/**\n * Calculates the W component of a quat from the X, Y, and Z components.\n * Assumes that quaternion is 1 unit in length.\n * Any existing W component will be ignored.\n *\n * @param {quat} out the receiving quaternion\n * @param {quat} a quat to calculate W component of\n * @returns {quat} out\n */\nfunction calculateW(out, a) {\n  var x = a[0],\n      y = a[1],\n      z = a[2];\n\n  out[0] = x;\n  out[1] = y;\n  out[2] = z;\n  out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));\n  return out;\n}\n\n/**\n * Performs a spherical linear interpolation between two quat\n *\n * @param {quat} out the receiving quaternion\n * @param {quat} a the first operand\n * @param {quat} b the second operand\n * @param {Number} t interpolation amount, in the range [0-1], between the two inputs\n * @returns {quat} out\n */\nfunction slerp(out, a, b, t) {\n  // benchmarks:\n  //    http://jsperf.com/quaternion-slerp-implementations\n  var ax = a[0],\n      ay = a[1],\n      az = a[2],\n      aw = a[3];\n  var bx = b[0],\n      by = b[1],\n      bz = b[2],\n      bw = b[3];\n\n  var omega = void 0,\n      cosom = void 0,\n      sinom = void 0,\n      scale0 = void 0,\n      scale1 = void 0;\n\n  // calc cosine\n  cosom = ax * bx + ay * by + az * bz + aw * bw;\n  // adjust signs (if necessary)\n  if (cosom < 0.0) {\n    cosom = -cosom;\n    bx = -bx;\n    by = -by;\n    bz = -bz;\n    bw = -bw;\n  }\n  // calculate coefficients\n  if (1.0 - cosom > 0.000001) {\n    // standard case (slerp)\n    omega = Math.acos(cosom);\n    sinom = Math.sin(omega);\n    scale0 = Math.sin((1.0 - t) * omega) / sinom;\n    scale1 = Math.sin(t * omega) / sinom;\n  } else {\n    // \"from\" and \"to\" quaternions are very close\n    //  ... so we can do a linear interpolation\n    scale0 = 1.0 - t;\n    scale1 = t;\n  }\n  // calculate final values\n  out[0] = scale0 * ax + scale1 * bx;\n  out[1] = scale0 * ay + scale1 * by;\n  out[2] = scale0 * az + scale1 * bz;\n  out[3] = scale0 * aw + scale1 * bw;\n\n  return out;\n}\n\n/**\n * Calculates the inverse of a quat\n *\n * @param {quat} out the receiving quaternion\n * @param {quat} a quat to calculate inverse of\n * @returns {quat} out\n */\nfunction invert(out, a) {\n  var a0 = a[0],\n      a1 = a[1],\n      a2 = a[2],\n      a3 = a[3];\n  var dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;\n  var invDot = dot ? 1.0 / dot : 0;\n\n  // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0\n\n  out[0] = -a0 * invDot;\n  out[1] = -a1 * invDot;\n  out[2] = -a2 * invDot;\n  out[3] = a3 * invDot;\n  return out;\n}\n\n/**\n * Calculates the conjugate of a quat\n * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.\n *\n * @param {quat} out the receiving quaternion\n * @param {quat} a quat to calculate conjugate of\n * @returns {quat} out\n */\nfunction conjugate(out, a) {\n  out[0] = -a[0];\n  out[1] = -a[1];\n  out[2] = -a[2];\n  out[3] = a[3];\n  return out;\n}\n\n/**\n * Creates a quaternion from the given 3x3 rotation matrix.\n *\n * NOTE: The resultant quaternion is not normalized, so you should be sure\n * to renormalize the quaternion yourself where necessary.\n *\n * @param {quat} out the receiving quaternion\n * @param {mat3} m rotation matrix\n * @returns {quat} out\n * @function\n */\nfunction fromMat3(out, m) {\n  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes\n  // article \"Quaternion Calculus and Fast Animation\".\n  var fTrace = m[0] + m[4] + m[8];\n  var fRoot = void 0;\n\n  if (fTrace > 0.0) {\n    // |w| > 1/2, may as well choose w > 1/2\n    fRoot = Math.sqrt(fTrace + 1.0); // 2w\n    out[3] = 0.5 * fRoot;\n    fRoot = 0.5 / fRoot; // 1/(4w)\n    out[0] = (m[5] - m[7]) * fRoot;\n    out[1] = (m[6] - m[2]) * fRoot;\n    out[2] = (m[1] - m[3]) * fRoot;\n  } else {\n    // |w| <= 1/2\n    var i = 0;\n    if (m[4] > m[0]) i = 1;\n    if (m[8] > m[i * 3 + i]) i = 2;\n    var j = (i + 1) % 3;\n    var k = (i + 2) % 3;\n\n    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);\n    out[i] = 0.5 * fRoot;\n    fRoot = 0.5 / fRoot;\n    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;\n    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;\n    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;\n  }\n\n  return out;\n}\n\n/**\n * Creates a quaternion from the given euler angle x, y, z.\n *\n * @param {quat} out the receiving quaternion\n * @param {x} Angle to rotate around X axis in degrees.\n * @param {y} Angle to rotate around Y axis in degrees.\n * @param {z} Angle to rotate around Z axis in degrees.\n * @returns {quat} out\n * @function\n */\nfunction fromEuler(out, x, y, z) {\n  var halfToRad = 0.5 * Math.PI / 180.0;\n  x *= halfToRad;\n  y *= halfToRad;\n  z *= halfToRad;\n\n  var sx = Math.sin(x);\n  var cx = Math.cos(x);\n  var sy = Math.sin(y);\n  var cy = Math.cos(y);\n  var sz = Math.sin(z);\n  var cz = Math.cos(z);\n\n  out[0] = sx * cy * cz - cx * sy * sz;\n  out[1] = cx * sy * cz + sx * cy * sz;\n  out[2] = cx * cy * sz - sx * sy * cz;\n  out[3] = cx * cy * cz + sx * sy * sz;\n\n  return out;\n}\n\n/**\n * Returns a string representation of a quatenion\n *\n * @param {quat} a vector to represent as a string\n * @returns {String} string representation of the vector\n */\nfunction str(a) {\n  return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';\n}\n\n/**\n * Creates a new quat initialized with values from an existing quaternion\n *\n * @param {quat} a quaternion to clone\n * @returns {quat} a new quaternion\n * @function\n */\nvar clone = exports.clone = vec4.clone;\n\n/**\n * Creates a new quat initialized with the given values\n *\n * @param {Number} x X component\n * @param {Number} y Y component\n * @param {Number} z Z component\n * @param {Number} w W component\n * @returns {quat} a new quaternion\n * @function\n */\nvar fromValues = exports.fromValues = vec4.fromValues;\n\n/**\n * Copy the values from one quat to another\n *\n * @param {quat} out the receiving quaternion\n * @param {quat} a the source quaternion\n * @returns {quat} out\n * @function\n */\nvar copy = exports.copy = vec4.copy;\n\n/**\n * Set the components of a quat to the given values\n *\n * @param {quat} out the receiving quaternion\n * @param {Number} x X component\n * @param {Number} y Y component\n * @param {Number} z Z component\n * @param {Number} w W component\n * @returns {quat} out\n * @function\n */\nvar set = exports.set = vec4.set;\n\n/**\n * Adds two quat's\n *\n * @param {quat} out the receiving quaternion\n * @param {quat} a the first operand\n * @param {quat} b the second operand\n * @returns {quat} out\n * @function\n */\nvar add = exports.add = vec4.add;\n\n/**\n * Alias for {@link quat.multiply}\n * @function\n */\nvar mul = exports.mul = multiply;\n\n/**\n * Scales a quat by a scalar number\n *\n * @param {quat} out the receiving vector\n * @param {quat} a the vector to scale\n * @param {Number} b amount to scale the vector by\n * @returns {quat} out\n * @function\n */\nvar scale = exports.scale = vec4.scale;\n\n/**\n * Calculates the dot product of two quat's\n *\n * @param {quat} a the first operand\n * @param {quat} b the second operand\n * @returns {Number} dot product of a and b\n * @function\n */\nvar dot = exports.dot = vec4.dot;\n\n/**\n * Performs a linear interpolation between two quat's\n *\n * @param {quat} out the receiving quaternion\n * @param {quat} a the first operand\n * @param {quat} b the second operand\n * @param {Number} t interpolation amount, in the range [0-1], between the two inputs\n * @returns {quat} out\n * @function\n */\nvar lerp = exports.lerp = vec4.lerp;\n\n/**\n * Calculates the length of a quat\n *\n * @param {quat} a vector to calculate length of\n * @returns {Number} length of a\n */\nvar length = exports.length = vec4.length;\n\n/**\n * Alias for {@link quat.length}\n * @function\n */\nvar len = exports.len = length;\n\n/**\n * Calculates the squared length of a quat\n *\n * @param {quat} a vector to calculate squared length of\n * @returns {Number} squared length of a\n * @function\n */\nvar squaredLength = exports.squaredLength = vec4.squaredLength;\n\n/**\n * Alias for {@link quat.squaredLength}\n * @function\n */\nvar sqrLen = exports.sqrLen = squaredLength;\n\n/**\n * Normalize a quat\n *\n * @param {quat} out the receiving quaternion\n * @param {quat} a quaternion to normalize\n * @returns {quat} out\n * @function\n */\nvar normalize = exports.normalize = vec4.normalize;\n\n/**\n * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)\n *\n * @param {quat} a The first quaternion.\n * @param {quat} b The second quaternion.\n * @returns {Boolean} True if the vectors are equal, false otherwise.\n */\nvar exactEquals = exports.exactEquals = vec4.exactEquals;\n\n/**\n * Returns whether or not the quaternions have approximately the same elements in the same position.\n *\n * @param {quat} a The first vector.\n * @param {quat} b The second vector.\n * @returns {Boolean} True if the vectors are equal, false otherwise.\n */\nvar equals = exports.equals = vec4.equals;\n\n/**\n * Sets a quaternion to represent the shortest rotation from one\n * vector to another.\n *\n * Both vectors are assumed to be unit length.\n *\n * @param {quat} out the receiving quaternion.\n * @param {vec3} a the initial vector\n * @param {vec3} b the destination vector\n * @returns {quat} out\n */\nvar rotationTo = exports.rotationTo = function () {\n  var tmpvec3 = vec3.create();\n  var xUnitVec3 = vec3.fromValues(1, 0, 0);\n  var yUnitVec3 = vec3.fromValues(0, 1, 0);\n\n  return function (out, a, b) {\n    var dot = vec3.dot(a, b);\n    if (dot < -0.999999) {\n      vec3.cross(tmpvec3, xUnitVec3, a);\n      if (vec3.len(tmpvec3) < 0.000001) vec3.cross(tmpvec3, yUnitVec3, a);\n      vec3.normalize(tmpvec3, tmpvec3);\n      setAxisAngle(out, tmpvec3, Math.PI);\n      return out;\n    } else if (dot > 0.999999) {\n      out[0] = 0;\n      out[1] = 0;\n      out[2] = 0;\n      out[3] = 1;\n      return out;\n    } else {\n      vec3.cross(tmpvec3, a, b);\n      out[0] = tmpvec3[0];\n      out[1] = tmpvec3[1];\n      out[2] = tmpvec3[2];\n      out[3] = 1 + dot;\n      return normalize(out, out);\n    }\n  };\n}();\n\n/**\n * Performs a spherical linear interpolation with two control points\n *\n * @param {quat} out the receiving quaternion\n * @param {quat} a the first operand\n * @param {quat} b the second operand\n * @param {quat} c the third operand\n * @param {quat} d the fourth operand\n * @param {Number} t interpolation amount, in the range [0-1], between the two inputs\n * @returns {quat} out\n */\nvar sqlerp = exports.sqlerp = function () {\n  var temp1 = create();\n  var temp2 = create();\n\n  return function (out, a, b, c, d, t) {\n    slerp(temp1, a, d, t);\n    slerp(temp2, b, c, t);\n    slerp(out, temp1, temp2, 2 * t * (1 - t));\n\n    return out;\n  };\n}();\n\n/**\n * Sets the specified quaternion with values corresponding to the given\n * axes. Each axis is a vec3 and is expected to be unit length and\n * perpendicular to all other specified axes.\n *\n * @param {vec3} view  the vector representing the viewing direction\n * @param {vec3} right the vector representing the local \"right\" direction\n * @param {vec3} up    the vector representing the local \"up\" direction\n * @returns {quat} out\n */\nvar setAxes = exports.setAxes = function () {\n  var matr = mat3.create();\n\n  return function (out, view, right, up) {\n    matr[0] = right[0];\n    matr[3] = right[1];\n    matr[6] = right[2];\n\n    matr[1] = up[0];\n    matr[4] = up[1];\n    matr[7] = up[2];\n\n    matr[2] = -view[0];\n    matr[5] = -view[1];\n    matr[8] = -view[2];\n\n    return normalize(out, fromMat3(out, matr));\n  };\n}();\n\n//# sourceURL=webpack:///./src/gl-matrix/quat.js?");

            /***/
          },

          /***/"./src/gl-matrix/quat2.js":
          /*!********************************!*\
            !*** ./src/gl-matrix/quat2.js ***!
            \********************************/
          /*! no static exports found */
          /***/function srcGlMatrixQuat2Js(module, exports, __webpack_require__) {

            "use strict";

            eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.sqrLen = exports.squaredLength = exports.len = exports.length = exports.dot = exports.mul = exports.setReal = exports.getReal = undefined;\nexports.create = create;\nexports.clone = clone;\nexports.fromValues = fromValues;\nexports.fromRotationTranslationValues = fromRotationTranslationValues;\nexports.fromRotationTranslation = fromRotationTranslation;\nexports.fromTranslation = fromTranslation;\nexports.fromRotation = fromRotation;\nexports.fromMat4 = fromMat4;\nexports.copy = copy;\nexports.identity = identity;\nexports.set = set;\nexports.getDual = getDual;\nexports.setDual = setDual;\nexports.getTranslation = getTranslation;\nexports.translate = translate;\nexports.rotateX = rotateX;\nexports.rotateY = rotateY;\nexports.rotateZ = rotateZ;\nexports.rotateByQuatAppend = rotateByQuatAppend;\nexports.rotateByQuatPrepend = rotateByQuatPrepend;\nexports.rotateAroundAxis = rotateAroundAxis;\nexports.add = add;\nexports.multiply = multiply;\nexports.scale = scale;\nexports.lerp = lerp;\nexports.invert = invert;\nexports.conjugate = conjugate;\nexports.normalize = normalize;\nexports.str = str;\nexports.exactEquals = exactEquals;\nexports.equals = equals;\n\nvar _common = __webpack_require__(/*! ./common.js */ \"./src/gl-matrix/common.js\");\n\nvar glMatrix = _interopRequireWildcard(_common);\n\nvar _quat = __webpack_require__(/*! ./quat.js */ \"./src/gl-matrix/quat.js\");\n\nvar quat = _interopRequireWildcard(_quat);\n\nvar _mat = __webpack_require__(/*! ./mat4.js */ \"./src/gl-matrix/mat4.js\");\n\nvar mat4 = _interopRequireWildcard(_mat);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\n/**\n * Dual Quaternion<br>\n * Format: [real, dual]<br>\n * Quaternion format: XYZW<br>\n * Make sure to have normalized dual quaternions, otherwise the functions may not work as intended.<br>\n * @module quat2\n */\n\n/**\n * Creates a new identity dual quat\n *\n * @returns {quat2} a new dual quaternion [real -> rotation, dual -> translation]\n */\nfunction create() {\n  var dq = new glMatrix.ARRAY_TYPE(8);\n  dq[0] = 0;\n  dq[1] = 0;\n  dq[2] = 0;\n  dq[3] = 1;\n  dq[4] = 0;\n  dq[5] = 0;\n  dq[6] = 0;\n  dq[7] = 0;\n  return dq;\n}\n\n/**\n * Creates a new quat initialized with values from an existing quaternion\n *\n * @param {quat2} a dual quaternion to clone\n * @returns {quat2} new dual quaternion\n * @function\n */\nfunction clone(a) {\n  var dq = new glMatrix.ARRAY_TYPE(8);\n  dq[0] = a[0];\n  dq[1] = a[1];\n  dq[2] = a[2];\n  dq[3] = a[3];\n  dq[4] = a[4];\n  dq[5] = a[5];\n  dq[6] = a[6];\n  dq[7] = a[7];\n  return dq;\n}\n\n/**\n * Creates a new dual quat initialized with the given values\n *\n * @param {Number} x1 X component\n * @param {Number} y1 Y component\n * @param {Number} z1 Z component\n * @param {Number} w1 W component\n * @param {Number} x2 X component\n * @param {Number} y2 Y component\n * @param {Number} z2 Z component\n * @param {Number} w2 W component\n * @returns {quat2} new dual quaternion\n * @function\n */\nfunction fromValues(x1, y1, z1, w1, x2, y2, z2, w2) {\n  var dq = new glMatrix.ARRAY_TYPE(8);\n  dq[0] = x1;\n  dq[1] = y1;\n  dq[2] = z1;\n  dq[3] = w1;\n  dq[4] = x2;\n  dq[5] = y2;\n  dq[6] = z2;\n  dq[7] = w2;\n  return dq;\n}\n\n/**\n * Creates a new dual quat from the given values (quat and translation)\n *\n * @param {Number} x1 X component\n * @param {Number} y1 Y component\n * @param {Number} z1 Z component\n * @param {Number} w1 W component\n * @param {Number} x2 X component (translation)\n * @param {Number} y2 Y component (translation)\n * @param {Number} z2 Z component (translation)\n * @returns {quat2} new dual quaternion\n * @function\n */\nfunction fromRotationTranslationValues(x1, y1, z1, w1, x2, y2, z2) {\n  var dq = new glMatrix.ARRAY_TYPE(8);\n  dq[0] = x1;\n  dq[1] = y1;\n  dq[2] = z1;\n  dq[3] = w1;\n  var ax = x2 * 0.5,\n      ay = y2 * 0.5,\n      az = z2 * 0.5;\n  dq[4] = ax * w1 + ay * z1 - az * y1;\n  dq[5] = ay * w1 + az * x1 - ax * z1;\n  dq[6] = az * w1 + ax * y1 - ay * x1;\n  dq[7] = -ax * x1 - ay * y1 - az * z1;\n  return dq;\n}\n\n/**\n * Creates a dual quat from a quaternion and a translation\n *\n * @param {quat2} dual quaternion receiving operation result\n * @param {quat} q quaternion\n * @param {vec3} t tranlation vector\n * @returns {quat2} dual quaternion receiving operation result\n * @function\n */\nfunction fromRotationTranslation(out, q, t) {\n  var ax = t[0] * 0.5,\n      ay = t[1] * 0.5,\n      az = t[2] * 0.5,\n      bx = q[0],\n      by = q[1],\n      bz = q[2],\n      bw = q[3];\n  out[0] = bx;\n  out[1] = by;\n  out[2] = bz;\n  out[3] = bw;\n  out[4] = ax * bw + ay * bz - az * by;\n  out[5] = ay * bw + az * bx - ax * bz;\n  out[6] = az * bw + ax * by - ay * bx;\n  out[7] = -ax * bx - ay * by - az * bz;\n  return out;\n}\n\n/**\n * Creates a dual quat from a translation\n *\n * @param {quat2} dual quaternion receiving operation result\n * @param {vec3} t translation vector\n * @returns {quat2} dual quaternion receiving operation result\n * @function\n */\nfunction fromTranslation(out, t) {\n  out[0] = 0;\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = 1;\n  out[4] = t[0] * 0.5;\n  out[5] = t[1] * 0.5;\n  out[6] = t[2] * 0.5;\n  out[7] = 0;\n  return out;\n}\n\n/**\n * Creates a dual quat from a quaternion\n *\n * @param {quat2} dual quaternion receiving operation result\n * @param {quat} q the quaternion\n * @returns {quat2} dual quaternion receiving operation result\n * @function\n */\nfunction fromRotation(out, q) {\n  out[0] = q[0];\n  out[1] = q[1];\n  out[2] = q[2];\n  out[3] = q[3];\n  out[4] = 0;\n  out[5] = 0;\n  out[6] = 0;\n  out[7] = 0;\n  return out;\n}\n\n/**\n * Creates a new dual quat from a matrix (4x4)\n *\n * @param {quat2} out the dual quaternion\n * @param {mat4} a the matrix\n * @returns {quat2} dual quat receiving operation result\n * @function\n */\nfunction fromMat4(out, a) {\n  //TODO Optimize this\n  var outer = quat.create();\n  mat4.getRotation(outer, a);\n  var t = new glMatrix.ARRAY_TYPE(3);\n  mat4.getTranslation(t, a);\n  fromRotationTranslation(out, outer, t);\n  return out;\n}\n\n/**\n * Copy the values from one dual quat to another\n *\n * @param {quat2} out the receiving dual quaternion\n * @param {quat2} a the source dual quaternion\n * @returns {quat2} out\n * @function\n */\nfunction copy(out, a) {\n  out[0] = a[0];\n  out[1] = a[1];\n  out[2] = a[2];\n  out[3] = a[3];\n  out[4] = a[4];\n  out[5] = a[5];\n  out[6] = a[6];\n  out[7] = a[7];\n  return out;\n}\n\n/**\n * Set a dual quat to the identity dual quaternion\n *\n * @param {quat2} out the receiving quaternion\n * @returns {quat2} out\n */\nfunction identity(out) {\n  out[0] = 0;\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = 1;\n  out[4] = 0;\n  out[5] = 0;\n  out[6] = 0;\n  out[7] = 0;\n  return out;\n}\n\n/**\n * Set the components of a dual quat to the given values\n *\n * @param {quat2} out the receiving quaternion\n * @param {Number} x1 X component\n * @param {Number} y1 Y component\n * @param {Number} z1 Z component\n * @param {Number} w1 W component\n * @param {Number} x2 X component\n * @param {Number} y2 Y component\n * @param {Number} z2 Z component\n * @param {Number} w2 W component\n * @returns {quat2} out\n * @function\n */\nfunction set(out, x1, y1, z1, w1, x2, y2, z2, w2) {\n  out[0] = x1;\n  out[1] = y1;\n  out[2] = z1;\n  out[3] = w1;\n\n  out[4] = x2;\n  out[5] = y2;\n  out[6] = z2;\n  out[7] = w2;\n  return out;\n}\n\n/**\n * Gets the real part of a dual quat\n * @param  {quat} out real part\n * @param  {quat2} a Dual Quaternion\n * @return {quat} real part\n */\nvar getReal = exports.getReal = quat.copy;\n\n/**\n * Gets the dual part of a dual quat\n * @param  {quat} out dual part\n * @param  {quat2} a Dual Quaternion\n * @return {quat} dual part\n */\nfunction getDual(out, a) {\n  out[0] = a[4];\n  out[1] = a[5];\n  out[2] = a[6];\n  out[3] = a[7];\n  return out;\n}\n\n/**\n * Set the real component of a dual quat to the given quaternion\n *\n * @param {quat2} out the receiving quaternion\n * @param {quat} q a quaternion representing the real part\n * @returns {quat2} out\n * @function\n */\nvar setReal = exports.setReal = quat.copy;\n\n/**\n * Set the dual component of a dual quat to the given quaternion\n *\n * @param {quat2} out the receiving quaternion\n * @param {quat} q a quaternion representing the dual part\n * @returns {quat2} out\n * @function\n */\nfunction setDual(out, q) {\n  out[4] = q[0];\n  out[5] = q[1];\n  out[6] = q[2];\n  out[7] = q[3];\n  return out;\n}\n\n/**\n * Gets the translation of a normalized dual quat\n * @param  {vec3} out translation\n * @param  {quat2} a Dual Quaternion to be decomposed\n * @return {vec3} translation\n */\nfunction getTranslation(out, a) {\n  var ax = a[4],\n      ay = a[5],\n      az = a[6],\n      aw = a[7],\n      bx = -a[0],\n      by = -a[1],\n      bz = -a[2],\n      bw = a[3];\n  out[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;\n  out[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;\n  out[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;\n  return out;\n}\n\n/**\n * Translates a dual quat by the given vector\n *\n * @param {quat2} out the receiving dual quaternion\n * @param {quat2} a the dual quaternion to translate\n * @param {vec3} v vector to translate by\n * @returns {quat2} out\n */\nfunction translate(out, a, v) {\n  var ax1 = a[0],\n      ay1 = a[1],\n      az1 = a[2],\n      aw1 = a[3],\n      bx1 = v[0] * 0.5,\n      by1 = v[1] * 0.5,\n      bz1 = v[2] * 0.5,\n      ax2 = a[4],\n      ay2 = a[5],\n      az2 = a[6],\n      aw2 = a[7];\n  out[0] = ax1;\n  out[1] = ay1;\n  out[2] = az1;\n  out[3] = aw1;\n  out[4] = aw1 * bx1 + ay1 * bz1 - az1 * by1 + ax2;\n  out[5] = aw1 * by1 + az1 * bx1 - ax1 * bz1 + ay2;\n  out[6] = aw1 * bz1 + ax1 * by1 - ay1 * bx1 + az2;\n  out[7] = -ax1 * bx1 - ay1 * by1 - az1 * bz1 + aw2;\n  return out;\n}\n\n/**\n * Rotates a dual quat around the X axis\n *\n * @param {quat2} out the receiving dual quaternion\n * @param {quat2} a the dual quaternion to rotate\n * @param {number} rad how far should the rotation be\n * @returns {quat2} out\n */\nfunction rotateX(out, a, rad) {\n  var bx = -a[0],\n      by = -a[1],\n      bz = -a[2],\n      bw = a[3],\n      ax = a[4],\n      ay = a[5],\n      az = a[6],\n      aw = a[7],\n      ax1 = ax * bw + aw * bx + ay * bz - az * by,\n      ay1 = ay * bw + aw * by + az * bx - ax * bz,\n      az1 = az * bw + aw * bz + ax * by - ay * bx,\n      aw1 = aw * bw - ax * bx - ay * by - az * bz;\n  quat.rotateX(out, a, rad);\n  bx = out[0];\n  by = out[1];\n  bz = out[2];\n  bw = out[3];\n  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;\n  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;\n  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;\n  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;\n  return out;\n}\n\n/**\n * Rotates a dual quat around the Y axis\n *\n * @param {quat2} out the receiving dual quaternion\n * @param {quat2} a the dual quaternion to rotate\n * @param {number} rad how far should the rotation be\n * @returns {quat2} out\n */\nfunction rotateY(out, a, rad) {\n  var bx = -a[0],\n      by = -a[1],\n      bz = -a[2],\n      bw = a[3],\n      ax = a[4],\n      ay = a[5],\n      az = a[6],\n      aw = a[7],\n      ax1 = ax * bw + aw * bx + ay * bz - az * by,\n      ay1 = ay * bw + aw * by + az * bx - ax * bz,\n      az1 = az * bw + aw * bz + ax * by - ay * bx,\n      aw1 = aw * bw - ax * bx - ay * by - az * bz;\n  quat.rotateY(out, a, rad);\n  bx = out[0];\n  by = out[1];\n  bz = out[2];\n  bw = out[3];\n  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;\n  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;\n  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;\n  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;\n  return out;\n}\n\n/**\n * Rotates a dual quat around the Z axis\n *\n * @param {quat2} out the receiving dual quaternion\n * @param {quat2} a the dual quaternion to rotate\n * @param {number} rad how far should the rotation be\n * @returns {quat2} out\n */\nfunction rotateZ(out, a, rad) {\n  var bx = -a[0],\n      by = -a[1],\n      bz = -a[2],\n      bw = a[3],\n      ax = a[4],\n      ay = a[5],\n      az = a[6],\n      aw = a[7],\n      ax1 = ax * bw + aw * bx + ay * bz - az * by,\n      ay1 = ay * bw + aw * by + az * bx - ax * bz,\n      az1 = az * bw + aw * bz + ax * by - ay * bx,\n      aw1 = aw * bw - ax * bx - ay * by - az * bz;\n  quat.rotateZ(out, a, rad);\n  bx = out[0];\n  by = out[1];\n  bz = out[2];\n  bw = out[3];\n  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;\n  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;\n  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;\n  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;\n  return out;\n}\n\n/**\n * Rotates a dual quat by a given quaternion (a * q)\n *\n * @param {quat2} out the receiving dual quaternion\n * @param {quat2} a the dual quaternion to rotate\n * @param {quat} q quaternion to rotate by\n * @returns {quat2} out\n */\nfunction rotateByQuatAppend(out, a, q) {\n  var qx = q[0],\n      qy = q[1],\n      qz = q[2],\n      qw = q[3],\n      ax = a[0],\n      ay = a[1],\n      az = a[2],\n      aw = a[3];\n\n  out[0] = ax * qw + aw * qx + ay * qz - az * qy;\n  out[1] = ay * qw + aw * qy + az * qx - ax * qz;\n  out[2] = az * qw + aw * qz + ax * qy - ay * qx;\n  out[3] = aw * qw - ax * qx - ay * qy - az * qz;\n  ax = a[4];\n  ay = a[5];\n  az = a[6];\n  aw = a[7];\n  out[4] = ax * qw + aw * qx + ay * qz - az * qy;\n  out[5] = ay * qw + aw * qy + az * qx - ax * qz;\n  out[6] = az * qw + aw * qz + ax * qy - ay * qx;\n  out[7] = aw * qw - ax * qx - ay * qy - az * qz;\n  return out;\n}\n\n/**\n * Rotates a dual quat by a given quaternion (q * a)\n *\n * @param {quat2} out the receiving dual quaternion\n * @param {quat} q quaternion to rotate by\n * @param {quat2} a the dual quaternion to rotate\n * @returns {quat2} out\n */\nfunction rotateByQuatPrepend(out, q, a) {\n  var qx = q[0],\n      qy = q[1],\n      qz = q[2],\n      qw = q[3],\n      bx = a[0],\n      by = a[1],\n      bz = a[2],\n      bw = a[3];\n\n  out[0] = qx * bw + qw * bx + qy * bz - qz * by;\n  out[1] = qy * bw + qw * by + qz * bx - qx * bz;\n  out[2] = qz * bw + qw * bz + qx * by - qy * bx;\n  out[3] = qw * bw - qx * bx - qy * by - qz * bz;\n  bx = a[4];\n  by = a[5];\n  bz = a[6];\n  bw = a[7];\n  out[4] = qx * bw + qw * bx + qy * bz - qz * by;\n  out[5] = qy * bw + qw * by + qz * bx - qx * bz;\n  out[6] = qz * bw + qw * bz + qx * by - qy * bx;\n  out[7] = qw * bw - qx * bx - qy * by - qz * bz;\n  return out;\n}\n\n/**\n * Rotates a dual quat around a given axis. Does the normalisation automatically\n *\n * @param {quat2} out the receiving dual quaternion\n * @param {quat2} a the dual quaternion to rotate\n * @param {vec3} axis the axis to rotate around\n * @param {Number} rad how far the rotation should be\n * @returns {quat2} out\n */\nfunction rotateAroundAxis(out, a, axis, rad) {\n  //Special case for rad = 0\n  if (Math.abs(rad) < glMatrix.EPSILON) {\n    return copy(out, a);\n  }\n  var axisLength = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);\n\n  rad = rad * 0.5;\n  var s = Math.sin(rad);\n  var bx = s * axis[0] / axisLength;\n  var by = s * axis[1] / axisLength;\n  var bz = s * axis[2] / axisLength;\n  var bw = Math.cos(rad);\n\n  var ax1 = a[0],\n      ay1 = a[1],\n      az1 = a[2],\n      aw1 = a[3];\n  out[0] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;\n  out[1] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;\n  out[2] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;\n  out[3] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;\n\n  var ax = a[4],\n      ay = a[5],\n      az = a[6],\n      aw = a[7];\n  out[4] = ax * bw + aw * bx + ay * bz - az * by;\n  out[5] = ay * bw + aw * by + az * bx - ax * bz;\n  out[6] = az * bw + aw * bz + ax * by - ay * bx;\n  out[7] = aw * bw - ax * bx - ay * by - az * bz;\n\n  return out;\n}\n\n/**\n * Adds two dual quat's\n *\n * @param {quat2} out the receiving dual quaternion\n * @param {quat2} a the first operand\n * @param {quat2} b the second operand\n * @returns {quat2} out\n * @function\n */\nfunction add(out, a, b) {\n  out[0] = a[0] + b[0];\n  out[1] = a[1] + b[1];\n  out[2] = a[2] + b[2];\n  out[3] = a[3] + b[3];\n  out[4] = a[4] + b[4];\n  out[5] = a[5] + b[5];\n  out[6] = a[6] + b[6];\n  out[7] = a[7] + b[7];\n  return out;\n}\n\n/**\n * Multiplies two dual quat's\n *\n * @param {quat2} out the receiving dual quaternion\n * @param {quat2} a the first operand\n * @param {quat2} b the second operand\n * @returns {quat2} out\n */\nfunction multiply(out, a, b) {\n  var ax0 = a[0],\n      ay0 = a[1],\n      az0 = a[2],\n      aw0 = a[3],\n      bx1 = b[4],\n      by1 = b[5],\n      bz1 = b[6],\n      bw1 = b[7],\n      ax1 = a[4],\n      ay1 = a[5],\n      az1 = a[6],\n      aw1 = a[7],\n      bx0 = b[0],\n      by0 = b[1],\n      bz0 = b[2],\n      bw0 = b[3];\n  out[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0;\n  out[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0;\n  out[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0;\n  out[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0;\n  out[4] = ax0 * bw1 + aw0 * bx1 + ay0 * bz1 - az0 * by1 + ax1 * bw0 + aw1 * bx0 + ay1 * bz0 - az1 * by0;\n  out[5] = ay0 * bw1 + aw0 * by1 + az0 * bx1 - ax0 * bz1 + ay1 * bw0 + aw1 * by0 + az1 * bx0 - ax1 * bz0;\n  out[6] = az0 * bw1 + aw0 * bz1 + ax0 * by1 - ay0 * bx1 + az1 * bw0 + aw1 * bz0 + ax1 * by0 - ay1 * bx0;\n  out[7] = aw0 * bw1 - ax0 * bx1 - ay0 * by1 - az0 * bz1 + aw1 * bw0 - ax1 * bx0 - ay1 * by0 - az1 * bz0;\n  return out;\n}\n\n/**\n * Alias for {@link quat2.multiply}\n * @function\n */\nvar mul = exports.mul = multiply;\n\n/**\n * Scales a dual quat by a scalar number\n *\n * @param {quat2} out the receiving dual quat\n * @param {quat2} a the dual quat to scale\n * @param {Number} b amount to scale the dual quat by\n * @returns {quat2} out\n * @function\n */\nfunction scale(out, a, b) {\n  out[0] = a[0] * b;\n  out[1] = a[1] * b;\n  out[2] = a[2] * b;\n  out[3] = a[3] * b;\n  out[4] = a[4] * b;\n  out[5] = a[5] * b;\n  out[6] = a[6] * b;\n  out[7] = a[7] * b;\n  return out;\n}\n\n/**\n * Calculates the dot product of two dual quat's (The dot product of the real parts)\n *\n * @param {quat2} a the first operand\n * @param {quat2} b the second operand\n * @returns {Number} dot product of a and b\n * @function\n */\nvar dot = exports.dot = quat.dot;\n\n/**\n * Performs a linear interpolation between two dual quats's\n * NOTE: The resulting dual quaternions won't always be normalized (The error is most noticeable when t = 0.5)\n *\n * @param {quat2} out the receiving dual quat\n * @param {quat2} a the first operand\n * @param {quat2} b the second operand\n * @param {Number} t interpolation amount, in the range [0-1], between the two inputs\n * @returns {quat2} out\n */\nfunction lerp(out, a, b, t) {\n  var mt = 1 - t;\n  if (dot(a, b) < 0) t = -t;\n\n  out[0] = a[0] * mt + b[0] * t;\n  out[1] = a[1] * mt + b[1] * t;\n  out[2] = a[2] * mt + b[2] * t;\n  out[3] = a[3] * mt + b[3] * t;\n  out[4] = a[4] * mt + b[4] * t;\n  out[5] = a[5] * mt + b[5] * t;\n  out[6] = a[6] * mt + b[6] * t;\n  out[7] = a[7] * mt + b[7] * t;\n\n  return out;\n}\n\n/**\n * Calculates the inverse of a dual quat. If they are normalized, conjugate is cheaper\n *\n * @param {quat2} out the receiving dual quaternion\n * @param {quat2} a dual quat to calculate inverse of\n * @returns {quat2} out\n */\nfunction invert(out, a) {\n  var sqlen = squaredLength(a);\n  out[0] = -a[0] / sqlen;\n  out[1] = -a[1] / sqlen;\n  out[2] = -a[2] / sqlen;\n  out[3] = a[3] / sqlen;\n  out[4] = -a[4] / sqlen;\n  out[5] = -a[5] / sqlen;\n  out[6] = -a[6] / sqlen;\n  out[7] = a[7] / sqlen;\n  return out;\n}\n\n/**\n * Calculates the conjugate of a dual quat\n * If the dual quaternion is normalized, this function is faster than quat2.inverse and produces the same result.\n *\n * @param {quat2} out the receiving quaternion\n * @param {quat2} a quat to calculate conjugate of\n * @returns {quat2} out\n */\nfunction conjugate(out, a) {\n  out[0] = -a[0];\n  out[1] = -a[1];\n  out[2] = -a[2];\n  out[3] = a[3];\n  out[4] = -a[4];\n  out[5] = -a[5];\n  out[6] = -a[6];\n  out[7] = a[7];\n  return out;\n}\n\n/**\n * Calculates the length of a dual quat\n *\n * @param {quat2} a dual quat to calculate length of\n * @returns {Number} length of a\n * @function\n */\nvar length = exports.length = quat.length;\n\n/**\n * Alias for {@link quat2.length}\n * @function\n */\nvar len = exports.len = length;\n\n/**\n * Calculates the squared length of a dual quat\n *\n * @param {quat2} a dual quat to calculate squared length of\n * @returns {Number} squared length of a\n * @function\n */\nvar squaredLength = exports.squaredLength = quat.squaredLength;\n\n/**\n * Alias for {@link quat2.squaredLength}\n * @function\n */\nvar sqrLen = exports.sqrLen = squaredLength;\n\n/**\n * Normalize a dual quat\n *\n * @param {quat2} out the receiving dual quaternion\n * @param {quat2} a dual quaternion to normalize\n * @returns {quat2} out\n * @function\n */\nfunction normalize(out, a) {\n  var magnitude = squaredLength(a);\n  if (magnitude > 0) {\n    magnitude = Math.sqrt(magnitude);\n    out[0] = a[0] / magnitude;\n    out[1] = a[1] / magnitude;\n    out[2] = a[2] / magnitude;\n    out[3] = a[3] / magnitude;\n    out[4] = a[4] / magnitude;\n    out[5] = a[5] / magnitude;\n    out[6] = a[6] / magnitude;\n    out[7] = a[7] / magnitude;\n  }\n  return out;\n}\n\n/**\n * Returns a string representation of a dual quatenion\n *\n * @param {quat2} a dual quaternion to represent as a string\n * @returns {String} string representation of the dual quat\n */\nfunction str(a) {\n  return 'quat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ')';\n}\n\n/**\n * Returns whether or not the dual quaternions have exactly the same elements in the same position (when compared with ===)\n *\n * @param {quat2} a the first dual quaternion.\n * @param {quat2} b the second dual quaternion.\n * @returns {Boolean} true if the dual quaternions are equal, false otherwise.\n */\nfunction exactEquals(a, b) {\n  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7];\n}\n\n/**\n * Returns whether or not the dual quaternions have approximately the same elements in the same position.\n *\n * @param {quat2} a the first dual quat.\n * @param {quat2} b the second dual quat.\n * @returns {Boolean} true if the dual quats are equal, false otherwise.\n */\nfunction equals(a, b) {\n  var a0 = a[0],\n      a1 = a[1],\n      a2 = a[2],\n      a3 = a[3],\n      a4 = a[4],\n      a5 = a[5],\n      a6 = a[6],\n      a7 = a[7];\n  var b0 = b[0],\n      b1 = b[1],\n      b2 = b[2],\n      b3 = b[3],\n      b4 = b[4],\n      b5 = b[5],\n      b6 = b[6],\n      b7 = b[7];\n  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7));\n}\n\n//# sourceURL=webpack:///./src/gl-matrix/quat2.js?");

            /***/
          },

          /***/"./src/gl-matrix/vec2.js":
          /*!*******************************!*\
            !*** ./src/gl-matrix/vec2.js ***!
            \*******************************/
          /*! no static exports found */
          /***/function srcGlMatrixVec2Js(module, exports, __webpack_require__) {

            "use strict";

            eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.forEach = exports.sqrLen = exports.sqrDist = exports.dist = exports.div = exports.mul = exports.sub = exports.len = undefined;\nexports.create = create;\nexports.clone = clone;\nexports.fromValues = fromValues;\nexports.copy = copy;\nexports.set = set;\nexports.add = add;\nexports.subtract = subtract;\nexports.multiply = multiply;\nexports.divide = divide;\nexports.ceil = ceil;\nexports.floor = floor;\nexports.min = min;\nexports.max = max;\nexports.round = round;\nexports.scale = scale;\nexports.scaleAndAdd = scaleAndAdd;\nexports.distance = distance;\nexports.squaredDistance = squaredDistance;\nexports.length = length;\nexports.squaredLength = squaredLength;\nexports.negate = negate;\nexports.inverse = inverse;\nexports.normalize = normalize;\nexports.dot = dot;\nexports.cross = cross;\nexports.lerp = lerp;\nexports.random = random;\nexports.transformMat2 = transformMat2;\nexports.transformMat2d = transformMat2d;\nexports.transformMat3 = transformMat3;\nexports.transformMat4 = transformMat4;\nexports.rotate = rotate;\nexports.angle = angle;\nexports.str = str;\nexports.exactEquals = exactEquals;\nexports.equals = equals;\n\nvar _common = __webpack_require__(/*! ./common.js */ \"./src/gl-matrix/common.js\");\n\nvar glMatrix = _interopRequireWildcard(_common);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\n/**\n * 2 Dimensional Vector\n * @module vec2\n */\n\n/**\n * Creates a new, empty vec2\n *\n * @returns {vec2} a new 2D vector\n */\nfunction create() {\n  var out = new glMatrix.ARRAY_TYPE(2);\n  out[0] = 0;\n  out[1] = 0;\n  return out;\n}\n\n/**\n * Creates a new vec2 initialized with values from an existing vector\n *\n * @param {vec2} a vector to clone\n * @returns {vec2} a new 2D vector\n */\nfunction clone(a) {\n  var out = new glMatrix.ARRAY_TYPE(2);\n  out[0] = a[0];\n  out[1] = a[1];\n  return out;\n}\n\n/**\n * Creates a new vec2 initialized with the given values\n *\n * @param {Number} x X component\n * @param {Number} y Y component\n * @returns {vec2} a new 2D vector\n */\nfunction fromValues(x, y) {\n  var out = new glMatrix.ARRAY_TYPE(2);\n  out[0] = x;\n  out[1] = y;\n  return out;\n}\n\n/**\n * Copy the values from one vec2 to another\n *\n * @param {vec2} out the receiving vector\n * @param {vec2} a the source vector\n * @returns {vec2} out\n */\nfunction copy(out, a) {\n  out[0] = a[0];\n  out[1] = a[1];\n  return out;\n}\n\n/**\n * Set the components of a vec2 to the given values\n *\n * @param {vec2} out the receiving vector\n * @param {Number} x X component\n * @param {Number} y Y component\n * @returns {vec2} out\n */\nfunction set(out, x, y) {\n  out[0] = x;\n  out[1] = y;\n  return out;\n}\n\n/**\n * Adds two vec2's\n *\n * @param {vec2} out the receiving vector\n * @param {vec2} a the first operand\n * @param {vec2} b the second operand\n * @returns {vec2} out\n */\nfunction add(out, a, b) {\n  out[0] = a[0] + b[0];\n  out[1] = a[1] + b[1];\n  return out;\n}\n\n/**\n * Subtracts vector b from vector a\n *\n * @param {vec2} out the receiving vector\n * @param {vec2} a the first operand\n * @param {vec2} b the second operand\n * @returns {vec2} out\n */\nfunction subtract(out, a, b) {\n  out[0] = a[0] - b[0];\n  out[1] = a[1] - b[1];\n  return out;\n}\n\n/**\n * Multiplies two vec2's\n *\n * @param {vec2} out the receiving vector\n * @param {vec2} a the first operand\n * @param {vec2} b the second operand\n * @returns {vec2} out\n */\nfunction multiply(out, a, b) {\n  out[0] = a[0] * b[0];\n  out[1] = a[1] * b[1];\n  return out;\n}\n\n/**\n * Divides two vec2's\n *\n * @param {vec2} out the receiving vector\n * @param {vec2} a the first operand\n * @param {vec2} b the second operand\n * @returns {vec2} out\n */\nfunction divide(out, a, b) {\n  out[0] = a[0] / b[0];\n  out[1] = a[1] / b[1];\n  return out;\n}\n\n/**\n * Math.ceil the components of a vec2\n *\n * @param {vec2} out the receiving vector\n * @param {vec2} a vector to ceil\n * @returns {vec2} out\n */\nfunction ceil(out, a) {\n  out[0] = Math.ceil(a[0]);\n  out[1] = Math.ceil(a[1]);\n  return out;\n}\n\n/**\n * Math.floor the components of a vec2\n *\n * @param {vec2} out the receiving vector\n * @param {vec2} a vector to floor\n * @returns {vec2} out\n */\nfunction floor(out, a) {\n  out[0] = Math.floor(a[0]);\n  out[1] = Math.floor(a[1]);\n  return out;\n}\n\n/**\n * Returns the minimum of two vec2's\n *\n * @param {vec2} out the receiving vector\n * @param {vec2} a the first operand\n * @param {vec2} b the second operand\n * @returns {vec2} out\n */\nfunction min(out, a, b) {\n  out[0] = Math.min(a[0], b[0]);\n  out[1] = Math.min(a[1], b[1]);\n  return out;\n}\n\n/**\n * Returns the maximum of two vec2's\n *\n * @param {vec2} out the receiving vector\n * @param {vec2} a the first operand\n * @param {vec2} b the second operand\n * @returns {vec2} out\n */\nfunction max(out, a, b) {\n  out[0] = Math.max(a[0], b[0]);\n  out[1] = Math.max(a[1], b[1]);\n  return out;\n}\n\n/**\n * Math.round the components of a vec2\n *\n * @param {vec2} out the receiving vector\n * @param {vec2} a vector to round\n * @returns {vec2} out\n */\nfunction round(out, a) {\n  out[0] = Math.round(a[0]);\n  out[1] = Math.round(a[1]);\n  return out;\n}\n\n/**\n * Scales a vec2 by a scalar number\n *\n * @param {vec2} out the receiving vector\n * @param {vec2} a the vector to scale\n * @param {Number} b amount to scale the vector by\n * @returns {vec2} out\n */\nfunction scale(out, a, b) {\n  out[0] = a[0] * b;\n  out[1] = a[1] * b;\n  return out;\n}\n\n/**\n * Adds two vec2's after scaling the second operand by a scalar value\n *\n * @param {vec2} out the receiving vector\n * @param {vec2} a the first operand\n * @param {vec2} b the second operand\n * @param {Number} scale the amount to scale b by before adding\n * @returns {vec2} out\n */\nfunction scaleAndAdd(out, a, b, scale) {\n  out[0] = a[0] + b[0] * scale;\n  out[1] = a[1] + b[1] * scale;\n  return out;\n}\n\n/**\n * Calculates the euclidian distance between two vec2's\n *\n * @param {vec2} a the first operand\n * @param {vec2} b the second operand\n * @returns {Number} distance between a and b\n */\nfunction distance(a, b) {\n  var x = b[0] - a[0],\n      y = b[1] - a[1];\n  return Math.sqrt(x * x + y * y);\n}\n\n/**\n * Calculates the squared euclidian distance between two vec2's\n *\n * @param {vec2} a the first operand\n * @param {vec2} b the second operand\n * @returns {Number} squared distance between a and b\n */\nfunction squaredDistance(a, b) {\n  var x = b[0] - a[0],\n      y = b[1] - a[1];\n  return x * x + y * y;\n}\n\n/**\n * Calculates the length of a vec2\n *\n * @param {vec2} a vector to calculate length of\n * @returns {Number} length of a\n */\nfunction length(a) {\n  var x = a[0],\n      y = a[1];\n  return Math.sqrt(x * x + y * y);\n}\n\n/**\n * Calculates the squared length of a vec2\n *\n * @param {vec2} a vector to calculate squared length of\n * @returns {Number} squared length of a\n */\nfunction squaredLength(a) {\n  var x = a[0],\n      y = a[1];\n  return x * x + y * y;\n}\n\n/**\n * Negates the components of a vec2\n *\n * @param {vec2} out the receiving vector\n * @param {vec2} a vector to negate\n * @returns {vec2} out\n */\nfunction negate(out, a) {\n  out[0] = -a[0];\n  out[1] = -a[1];\n  return out;\n}\n\n/**\n * Returns the inverse of the components of a vec2\n *\n * @param {vec2} out the receiving vector\n * @param {vec2} a vector to invert\n * @returns {vec2} out\n */\nfunction inverse(out, a) {\n  out[0] = 1.0 / a[0];\n  out[1] = 1.0 / a[1];\n  return out;\n}\n\n/**\n * Normalize a vec2\n *\n * @param {vec2} out the receiving vector\n * @param {vec2} a vector to normalize\n * @returns {vec2} out\n */\nfunction normalize(out, a) {\n  var x = a[0],\n      y = a[1];\n  var len = x * x + y * y;\n  if (len > 0) {\n    //TODO: evaluate use of glm_invsqrt here?\n    len = 1 / Math.sqrt(len);\n    out[0] = a[0] * len;\n    out[1] = a[1] * len;\n  }\n  return out;\n}\n\n/**\n * Calculates the dot product of two vec2's\n *\n * @param {vec2} a the first operand\n * @param {vec2} b the second operand\n * @returns {Number} dot product of a and b\n */\nfunction dot(a, b) {\n  return a[0] * b[0] + a[1] * b[1];\n}\n\n/**\n * Computes the cross product of two vec2's\n * Note that the cross product must by definition produce a 3D vector\n *\n * @param {vec3} out the receiving vector\n * @param {vec2} a the first operand\n * @param {vec2} b the second operand\n * @returns {vec3} out\n */\nfunction cross(out, a, b) {\n  var z = a[0] * b[1] - a[1] * b[0];\n  out[0] = out[1] = 0;\n  out[2] = z;\n  return out;\n}\n\n/**\n * Performs a linear interpolation between two vec2's\n *\n * @param {vec2} out the receiving vector\n * @param {vec2} a the first operand\n * @param {vec2} b the second operand\n * @param {Number} t interpolation amount, in the range [0-1], between the two inputs\n * @returns {vec2} out\n */\nfunction lerp(out, a, b, t) {\n  var ax = a[0],\n      ay = a[1];\n  out[0] = ax + t * (b[0] - ax);\n  out[1] = ay + t * (b[1] - ay);\n  return out;\n}\n\n/**\n * Generates a random vector with the given scale\n *\n * @param {vec2} out the receiving vector\n * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned\n * @returns {vec2} out\n */\nfunction random(out, scale) {\n  scale = scale || 1.0;\n  var r = glMatrix.RANDOM() * 2.0 * Math.PI;\n  out[0] = Math.cos(r) * scale;\n  out[1] = Math.sin(r) * scale;\n  return out;\n}\n\n/**\n * Transforms the vec2 with a mat2\n *\n * @param {vec2} out the receiving vector\n * @param {vec2} a the vector to transform\n * @param {mat2} m matrix to transform with\n * @returns {vec2} out\n */\nfunction transformMat2(out, a, m) {\n  var x = a[0],\n      y = a[1];\n  out[0] = m[0] * x + m[2] * y;\n  out[1] = m[1] * x + m[3] * y;\n  return out;\n}\n\n/**\n * Transforms the vec2 with a mat2d\n *\n * @param {vec2} out the receiving vector\n * @param {vec2} a the vector to transform\n * @param {mat2d} m matrix to transform with\n * @returns {vec2} out\n */\nfunction transformMat2d(out, a, m) {\n  var x = a[0],\n      y = a[1];\n  out[0] = m[0] * x + m[2] * y + m[4];\n  out[1] = m[1] * x + m[3] * y + m[5];\n  return out;\n}\n\n/**\n * Transforms the vec2 with a mat3\n * 3rd vector component is implicitly '1'\n *\n * @param {vec2} out the receiving vector\n * @param {vec2} a the vector to transform\n * @param {mat3} m matrix to transform with\n * @returns {vec2} out\n */\nfunction transformMat3(out, a, m) {\n  var x = a[0],\n      y = a[1];\n  out[0] = m[0] * x + m[3] * y + m[6];\n  out[1] = m[1] * x + m[4] * y + m[7];\n  return out;\n}\n\n/**\n * Transforms the vec2 with a mat4\n * 3rd vector component is implicitly '0'\n * 4th vector component is implicitly '1'\n *\n * @param {vec2} out the receiving vector\n * @param {vec2} a the vector to transform\n * @param {mat4} m matrix to transform with\n * @returns {vec2} out\n */\nfunction transformMat4(out, a, m) {\n  var x = a[0];\n  var y = a[1];\n  out[0] = m[0] * x + m[4] * y + m[12];\n  out[1] = m[1] * x + m[5] * y + m[13];\n  return out;\n}\n\n/**\n * Rotate a 2D vector\n * @param {vec2} out The receiving vec2\n * @param {vec2} a The vec2 point to rotate\n * @param {vec2} b The origin of the rotation\n * @param {Number} c The angle of rotation\n * @returns {vec2} out\n */\nfunction rotate(out, a, b, c) {\n  //Translate point to the origin\n  var p0 = a[0] - b[0],\n      p1 = a[1] - b[1],\n      sinC = Math.sin(c),\n      cosC = Math.cos(c);\n\n  //perform rotation and translate to correct position\n  out[0] = p0 * cosC - p1 * sinC + b[0];\n  out[1] = p0 * sinC + p1 * cosC + b[1];\n\n  return out;\n}\n\n/**\n * Get the angle between two 2D vectors\n * @param {vec2} a The first operand\n * @param {vec2} b The second operand\n * @returns {Number} The angle in radians\n */\nfunction angle(a, b) {\n  var x1 = a[0],\n      y1 = a[1],\n      x2 = b[0],\n      y2 = b[1];\n\n  var len1 = x1 * x1 + y1 * y1;\n  if (len1 > 0) {\n    //TODO: evaluate use of glm_invsqrt here?\n    len1 = 1 / Math.sqrt(len1);\n  }\n\n  var len2 = x2 * x2 + y2 * y2;\n  if (len2 > 0) {\n    //TODO: evaluate use of glm_invsqrt here?\n    len2 = 1 / Math.sqrt(len2);\n  }\n\n  var cosine = (x1 * x2 + y1 * y2) * len1 * len2;\n\n  if (cosine > 1.0) {\n    return 0;\n  } else if (cosine < -1.0) {\n    return Math.PI;\n  } else {\n    return Math.acos(cosine);\n  }\n}\n\n/**\n * Returns a string representation of a vector\n *\n * @param {vec2} a vector to represent as a string\n * @returns {String} string representation of the vector\n */\nfunction str(a) {\n  return 'vec2(' + a[0] + ', ' + a[1] + ')';\n}\n\n/**\n * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)\n *\n * @param {vec2} a The first vector.\n * @param {vec2} b The second vector.\n * @returns {Boolean} True if the vectors are equal, false otherwise.\n */\nfunction exactEquals(a, b) {\n  return a[0] === b[0] && a[1] === b[1];\n}\n\n/**\n * Returns whether or not the vectors have approximately the same elements in the same position.\n *\n * @param {vec2} a The first vector.\n * @param {vec2} b The second vector.\n * @returns {Boolean} True if the vectors are equal, false otherwise.\n */\nfunction equals(a, b) {\n  var a0 = a[0],\n      a1 = a[1];\n  var b0 = b[0],\n      b1 = b[1];\n  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1));\n}\n\n/**\n * Alias for {@link vec2.length}\n * @function\n */\nvar len = exports.len = length;\n\n/**\n * Alias for {@link vec2.subtract}\n * @function\n */\nvar sub = exports.sub = subtract;\n\n/**\n * Alias for {@link vec2.multiply}\n * @function\n */\nvar mul = exports.mul = multiply;\n\n/**\n * Alias for {@link vec2.divide}\n * @function\n */\nvar div = exports.div = divide;\n\n/**\n * Alias for {@link vec2.distance}\n * @function\n */\nvar dist = exports.dist = distance;\n\n/**\n * Alias for {@link vec2.squaredDistance}\n * @function\n */\nvar sqrDist = exports.sqrDist = squaredDistance;\n\n/**\n * Alias for {@link vec2.squaredLength}\n * @function\n */\nvar sqrLen = exports.sqrLen = squaredLength;\n\n/**\n * Perform some operation over an array of vec2s.\n *\n * @param {Array} a the array of vectors to iterate over\n * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed\n * @param {Number} offset Number of elements to skip at the beginning of the array\n * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array\n * @param {Function} fn Function to call for each vector in the array\n * @param {Object} [arg] additional argument to pass to fn\n * @returns {Array} a\n * @function\n */\nvar forEach = exports.forEach = function () {\n  var vec = create();\n\n  return function (a, stride, offset, count, fn, arg) {\n    var i = void 0,\n        l = void 0;\n    if (!stride) {\n      stride = 2;\n    }\n\n    if (!offset) {\n      offset = 0;\n    }\n\n    if (count) {\n      l = Math.min(count * stride + offset, a.length);\n    } else {\n      l = a.length;\n    }\n\n    for (i = offset; i < l; i += stride) {\n      vec[0] = a[i];vec[1] = a[i + 1];\n      fn(vec, vec, arg);\n      a[i] = vec[0];a[i + 1] = vec[1];\n    }\n\n    return a;\n  };\n}();\n\n//# sourceURL=webpack:///./src/gl-matrix/vec2.js?");

            /***/
          },

          /***/"./src/gl-matrix/vec3.js":
          /*!*******************************!*\
            !*** ./src/gl-matrix/vec3.js ***!
            \*******************************/
          /*! no static exports found */
          /***/function srcGlMatrixVec3Js(module, exports, __webpack_require__) {

            "use strict";

            eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.forEach = exports.sqrLen = exports.len = exports.sqrDist = exports.dist = exports.div = exports.mul = exports.sub = undefined;\nexports.create = create;\nexports.clone = clone;\nexports.length = length;\nexports.fromValues = fromValues;\nexports.copy = copy;\nexports.set = set;\nexports.add = add;\nexports.subtract = subtract;\nexports.multiply = multiply;\nexports.divide = divide;\nexports.ceil = ceil;\nexports.floor = floor;\nexports.min = min;\nexports.max = max;\nexports.round = round;\nexports.scale = scale;\nexports.scaleAndAdd = scaleAndAdd;\nexports.distance = distance;\nexports.squaredDistance = squaredDistance;\nexports.squaredLength = squaredLength;\nexports.negate = negate;\nexports.inverse = inverse;\nexports.normalize = normalize;\nexports.dot = dot;\nexports.cross = cross;\nexports.lerp = lerp;\nexports.hermite = hermite;\nexports.bezier = bezier;\nexports.random = random;\nexports.transformMat4 = transformMat4;\nexports.transformMat3 = transformMat3;\nexports.transformQuat = transformQuat;\nexports.rotateX = rotateX;\nexports.rotateY = rotateY;\nexports.rotateZ = rotateZ;\nexports.angle = angle;\nexports.str = str;\nexports.exactEquals = exactEquals;\nexports.equals = equals;\n\nvar _common = __webpack_require__(/*! ./common.js */ \"./src/gl-matrix/common.js\");\n\nvar glMatrix = _interopRequireWildcard(_common);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\n/**\n * 3 Dimensional Vector\n * @module vec3\n */\n\n/**\n * Creates a new, empty vec3\n *\n * @returns {vec3} a new 3D vector\n */\nfunction create() {\n  var out = new glMatrix.ARRAY_TYPE(3);\n  out[0] = 0;\n  out[1] = 0;\n  out[2] = 0;\n  return out;\n}\n\n/**\n * Creates a new vec3 initialized with values from an existing vector\n *\n * @param {vec3} a vector to clone\n * @returns {vec3} a new 3D vector\n */\nfunction clone(a) {\n  var out = new glMatrix.ARRAY_TYPE(3);\n  out[0] = a[0];\n  out[1] = a[1];\n  out[2] = a[2];\n  return out;\n}\n\n/**\n * Calculates the length of a vec3\n *\n * @param {vec3} a vector to calculate length of\n * @returns {Number} length of a\n */\nfunction length(a) {\n  var x = a[0];\n  var y = a[1];\n  var z = a[2];\n  return Math.sqrt(x * x + y * y + z * z);\n}\n\n/**\n * Creates a new vec3 initialized with the given values\n *\n * @param {Number} x X component\n * @param {Number} y Y component\n * @param {Number} z Z component\n * @returns {vec3} a new 3D vector\n */\nfunction fromValues(x, y, z) {\n  var out = new glMatrix.ARRAY_TYPE(3);\n  out[0] = x;\n  out[1] = y;\n  out[2] = z;\n  return out;\n}\n\n/**\n * Copy the values from one vec3 to another\n *\n * @param {vec3} out the receiving vector\n * @param {vec3} a the source vector\n * @returns {vec3} out\n */\nfunction copy(out, a) {\n  out[0] = a[0];\n  out[1] = a[1];\n  out[2] = a[2];\n  return out;\n}\n\n/**\n * Set the components of a vec3 to the given values\n *\n * @param {vec3} out the receiving vector\n * @param {Number} x X component\n * @param {Number} y Y component\n * @param {Number} z Z component\n * @returns {vec3} out\n */\nfunction set(out, x, y, z) {\n  out[0] = x;\n  out[1] = y;\n  out[2] = z;\n  return out;\n}\n\n/**\n * Adds two vec3's\n *\n * @param {vec3} out the receiving vector\n * @param {vec3} a the first operand\n * @param {vec3} b the second operand\n * @returns {vec3} out\n */\nfunction add(out, a, b) {\n  out[0] = a[0] + b[0];\n  out[1] = a[1] + b[1];\n  out[2] = a[2] + b[2];\n  return out;\n}\n\n/**\n * Subtracts vector b from vector a\n *\n * @param {vec3} out the receiving vector\n * @param {vec3} a the first operand\n * @param {vec3} b the second operand\n * @returns {vec3} out\n */\nfunction subtract(out, a, b) {\n  out[0] = a[0] - b[0];\n  out[1] = a[1] - b[1];\n  out[2] = a[2] - b[2];\n  return out;\n}\n\n/**\n * Multiplies two vec3's\n *\n * @param {vec3} out the receiving vector\n * @param {vec3} a the first operand\n * @param {vec3} b the second operand\n * @returns {vec3} out\n */\nfunction multiply(out, a, b) {\n  out[0] = a[0] * b[0];\n  out[1] = a[1] * b[1];\n  out[2] = a[2] * b[2];\n  return out;\n}\n\n/**\n * Divides two vec3's\n *\n * @param {vec3} out the receiving vector\n * @param {vec3} a the first operand\n * @param {vec3} b the second operand\n * @returns {vec3} out\n */\nfunction divide(out, a, b) {\n  out[0] = a[0] / b[0];\n  out[1] = a[1] / b[1];\n  out[2] = a[2] / b[2];\n  return out;\n}\n\n/**\n * Math.ceil the components of a vec3\n *\n * @param {vec3} out the receiving vector\n * @param {vec3} a vector to ceil\n * @returns {vec3} out\n */\nfunction ceil(out, a) {\n  out[0] = Math.ceil(a[0]);\n  out[1] = Math.ceil(a[1]);\n  out[2] = Math.ceil(a[2]);\n  return out;\n}\n\n/**\n * Math.floor the components of a vec3\n *\n * @param {vec3} out the receiving vector\n * @param {vec3} a vector to floor\n * @returns {vec3} out\n */\nfunction floor(out, a) {\n  out[0] = Math.floor(a[0]);\n  out[1] = Math.floor(a[1]);\n  out[2] = Math.floor(a[2]);\n  return out;\n}\n\n/**\n * Returns the minimum of two vec3's\n *\n * @param {vec3} out the receiving vector\n * @param {vec3} a the first operand\n * @param {vec3} b the second operand\n * @returns {vec3} out\n */\nfunction min(out, a, b) {\n  out[0] = Math.min(a[0], b[0]);\n  out[1] = Math.min(a[1], b[1]);\n  out[2] = Math.min(a[2], b[2]);\n  return out;\n}\n\n/**\n * Returns the maximum of two vec3's\n *\n * @param {vec3} out the receiving vector\n * @param {vec3} a the first operand\n * @param {vec3} b the second operand\n * @returns {vec3} out\n */\nfunction max(out, a, b) {\n  out[0] = Math.max(a[0], b[0]);\n  out[1] = Math.max(a[1], b[1]);\n  out[2] = Math.max(a[2], b[2]);\n  return out;\n}\n\n/**\n * Math.round the components of a vec3\n *\n * @param {vec3} out the receiving vector\n * @param {vec3} a vector to round\n * @returns {vec3} out\n */\nfunction round(out, a) {\n  out[0] = Math.round(a[0]);\n  out[1] = Math.round(a[1]);\n  out[2] = Math.round(a[2]);\n  return out;\n}\n\n/**\n * Scales a vec3 by a scalar number\n *\n * @param {vec3} out the receiving vector\n * @param {vec3} a the vector to scale\n * @param {Number} b amount to scale the vector by\n * @returns {vec3} out\n */\nfunction scale(out, a, b) {\n  out[0] = a[0] * b;\n  out[1] = a[1] * b;\n  out[2] = a[2] * b;\n  return out;\n}\n\n/**\n * Adds two vec3's after scaling the second operand by a scalar value\n *\n * @param {vec3} out the receiving vector\n * @param {vec3} a the first operand\n * @param {vec3} b the second operand\n * @param {Number} scale the amount to scale b by before adding\n * @returns {vec3} out\n */\nfunction scaleAndAdd(out, a, b, scale) {\n  out[0] = a[0] + b[0] * scale;\n  out[1] = a[1] + b[1] * scale;\n  out[2] = a[2] + b[2] * scale;\n  return out;\n}\n\n/**\n * Calculates the euclidian distance between two vec3's\n *\n * @param {vec3} a the first operand\n * @param {vec3} b the second operand\n * @returns {Number} distance between a and b\n */\nfunction distance(a, b) {\n  var x = b[0] - a[0];\n  var y = b[1] - a[1];\n  var z = b[2] - a[2];\n  return Math.sqrt(x * x + y * y + z * z);\n}\n\n/**\n * Calculates the squared euclidian distance between two vec3's\n *\n * @param {vec3} a the first operand\n * @param {vec3} b the second operand\n * @returns {Number} squared distance between a and b\n */\nfunction squaredDistance(a, b) {\n  var x = b[0] - a[0];\n  var y = b[1] - a[1];\n  var z = b[2] - a[2];\n  return x * x + y * y + z * z;\n}\n\n/**\n * Calculates the squared length of a vec3\n *\n * @param {vec3} a vector to calculate squared length of\n * @returns {Number} squared length of a\n */\nfunction squaredLength(a) {\n  var x = a[0];\n  var y = a[1];\n  var z = a[2];\n  return x * x + y * y + z * z;\n}\n\n/**\n * Negates the components of a vec3\n *\n * @param {vec3} out the receiving vector\n * @param {vec3} a vector to negate\n * @returns {vec3} out\n */\nfunction negate(out, a) {\n  out[0] = -a[0];\n  out[1] = -a[1];\n  out[2] = -a[2];\n  return out;\n}\n\n/**\n * Returns the inverse of the components of a vec3\n *\n * @param {vec3} out the receiving vector\n * @param {vec3} a vector to invert\n * @returns {vec3} out\n */\nfunction inverse(out, a) {\n  out[0] = 1.0 / a[0];\n  out[1] = 1.0 / a[1];\n  out[2] = 1.0 / a[2];\n  return out;\n}\n\n/**\n * Normalize a vec3\n *\n * @param {vec3} out the receiving vector\n * @param {vec3} a vector to normalize\n * @returns {vec3} out\n */\nfunction normalize(out, a) {\n  var x = a[0];\n  var y = a[1];\n  var z = a[2];\n  var len = x * x + y * y + z * z;\n  if (len > 0) {\n    //TODO: evaluate use of glm_invsqrt here?\n    len = 1 / Math.sqrt(len);\n    out[0] = a[0] * len;\n    out[1] = a[1] * len;\n    out[2] = a[2] * len;\n  }\n  return out;\n}\n\n/**\n * Calculates the dot product of two vec3's\n *\n * @param {vec3} a the first operand\n * @param {vec3} b the second operand\n * @returns {Number} dot product of a and b\n */\nfunction dot(a, b) {\n  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];\n}\n\n/**\n * Computes the cross product of two vec3's\n *\n * @param {vec3} out the receiving vector\n * @param {vec3} a the first operand\n * @param {vec3} b the second operand\n * @returns {vec3} out\n */\nfunction cross(out, a, b) {\n  var ax = a[0],\n      ay = a[1],\n      az = a[2];\n  var bx = b[0],\n      by = b[1],\n      bz = b[2];\n\n  out[0] = ay * bz - az * by;\n  out[1] = az * bx - ax * bz;\n  out[2] = ax * by - ay * bx;\n  return out;\n}\n\n/**\n * Performs a linear interpolation between two vec3's\n *\n * @param {vec3} out the receiving vector\n * @param {vec3} a the first operand\n * @param {vec3} b the second operand\n * @param {Number} t interpolation amount, in the range [0-1], between the two inputs\n * @returns {vec3} out\n */\nfunction lerp(out, a, b, t) {\n  var ax = a[0];\n  var ay = a[1];\n  var az = a[2];\n  out[0] = ax + t * (b[0] - ax);\n  out[1] = ay + t * (b[1] - ay);\n  out[2] = az + t * (b[2] - az);\n  return out;\n}\n\n/**\n * Performs a hermite interpolation with two control points\n *\n * @param {vec3} out the receiving vector\n * @param {vec3} a the first operand\n * @param {vec3} b the second operand\n * @param {vec3} c the third operand\n * @param {vec3} d the fourth operand\n * @param {Number} t interpolation amount, in the range [0-1], between the two inputs\n * @returns {vec3} out\n */\nfunction hermite(out, a, b, c, d, t) {\n  var factorTimes2 = t * t;\n  var factor1 = factorTimes2 * (2 * t - 3) + 1;\n  var factor2 = factorTimes2 * (t - 2) + t;\n  var factor3 = factorTimes2 * (t - 1);\n  var factor4 = factorTimes2 * (3 - 2 * t);\n\n  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;\n  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;\n  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;\n\n  return out;\n}\n\n/**\n * Performs a bezier interpolation with two control points\n *\n * @param {vec3} out the receiving vector\n * @param {vec3} a the first operand\n * @param {vec3} b the second operand\n * @param {vec3} c the third operand\n * @param {vec3} d the fourth operand\n * @param {Number} t interpolation amount, in the range [0-1], between the two inputs\n * @returns {vec3} out\n */\nfunction bezier(out, a, b, c, d, t) {\n  var inverseFactor = 1 - t;\n  var inverseFactorTimesTwo = inverseFactor * inverseFactor;\n  var factorTimes2 = t * t;\n  var factor1 = inverseFactorTimesTwo * inverseFactor;\n  var factor2 = 3 * t * inverseFactorTimesTwo;\n  var factor3 = 3 * factorTimes2 * inverseFactor;\n  var factor4 = factorTimes2 * t;\n\n  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;\n  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;\n  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;\n\n  return out;\n}\n\n/**\n * Generates a random vector with the given scale\n *\n * @param {vec3} out the receiving vector\n * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned\n * @returns {vec3} out\n */\nfunction random(out, scale) {\n  scale = scale || 1.0;\n\n  var r = glMatrix.RANDOM() * 2.0 * Math.PI;\n  var z = glMatrix.RANDOM() * 2.0 - 1.0;\n  var zScale = Math.sqrt(1.0 - z * z) * scale;\n\n  out[0] = Math.cos(r) * zScale;\n  out[1] = Math.sin(r) * zScale;\n  out[2] = z * scale;\n  return out;\n}\n\n/**\n * Transforms the vec3 with a mat4.\n * 4th vector component is implicitly '1'\n *\n * @param {vec3} out the receiving vector\n * @param {vec3} a the vector to transform\n * @param {mat4} m matrix to transform with\n * @returns {vec3} out\n */\nfunction transformMat4(out, a, m) {\n  var x = a[0],\n      y = a[1],\n      z = a[2];\n  var w = m[3] * x + m[7] * y + m[11] * z + m[15];\n  w = w || 1.0;\n  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;\n  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;\n  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;\n  return out;\n}\n\n/**\n * Transforms the vec3 with a mat3.\n *\n * @param {vec3} out the receiving vector\n * @param {vec3} a the vector to transform\n * @param {mat3} m the 3x3 matrix to transform with\n * @returns {vec3} out\n */\nfunction transformMat3(out, a, m) {\n  var x = a[0],\n      y = a[1],\n      z = a[2];\n  out[0] = x * m[0] + y * m[3] + z * m[6];\n  out[1] = x * m[1] + y * m[4] + z * m[7];\n  out[2] = x * m[2] + y * m[5] + z * m[8];\n  return out;\n}\n\n/**\n * Transforms the vec3 with a quat\n * Can also be used for dual quaternions. (Multiply it with the real part)\n *\n * @param {vec3} out the receiving vector\n * @param {vec3} a the vector to transform\n * @param {quat} q quaternion to transform with\n * @returns {vec3} out\n */\nfunction transformQuat(out, a, q) {\n  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed\n  var qx = q[0],\n      qy = q[1],\n      qz = q[2],\n      qw = q[3];\n  var x = a[0],\n      y = a[1],\n      z = a[2];\n  // var qvec = [qx, qy, qz];\n  // var uv = vec3.cross([], qvec, a);\n  var uvx = qy * z - qz * y,\n      uvy = qz * x - qx * z,\n      uvz = qx * y - qy * x;\n  // var uuv = vec3.cross([], qvec, uv);\n  var uuvx = qy * uvz - qz * uvy,\n      uuvy = qz * uvx - qx * uvz,\n      uuvz = qx * uvy - qy * uvx;\n  // vec3.scale(uv, uv, 2 * w);\n  var w2 = qw * 2;\n  uvx *= w2;\n  uvy *= w2;\n  uvz *= w2;\n  // vec3.scale(uuv, uuv, 2);\n  uuvx *= 2;\n  uuvy *= 2;\n  uuvz *= 2;\n  // return vec3.add(out, a, vec3.add(out, uv, uuv));\n  out[0] = x + uvx + uuvx;\n  out[1] = y + uvy + uuvy;\n  out[2] = z + uvz + uuvz;\n  return out;\n}\n\n/**\n * Rotate a 3D vector around the x-axis\n * @param {vec3} out The receiving vec3\n * @param {vec3} a The vec3 point to rotate\n * @param {vec3} b The origin of the rotation\n * @param {Number} c The angle of rotation\n * @returns {vec3} out\n */\nfunction rotateX(out, a, b, c) {\n  var p = [],\n      r = [];\n  //Translate point to the origin\n  p[0] = a[0] - b[0];\n  p[1] = a[1] - b[1];\n  p[2] = a[2] - b[2];\n\n  //perform rotation\n  r[0] = p[0];\n  r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c);\n  r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c);\n\n  //translate to correct position\n  out[0] = r[0] + b[0];\n  out[1] = r[1] + b[1];\n  out[2] = r[2] + b[2];\n\n  return out;\n}\n\n/**\n * Rotate a 3D vector around the y-axis\n * @param {vec3} out The receiving vec3\n * @param {vec3} a The vec3 point to rotate\n * @param {vec3} b The origin of the rotation\n * @param {Number} c The angle of rotation\n * @returns {vec3} out\n */\nfunction rotateY(out, a, b, c) {\n  var p = [],\n      r = [];\n  //Translate point to the origin\n  p[0] = a[0] - b[0];\n  p[1] = a[1] - b[1];\n  p[2] = a[2] - b[2];\n\n  //perform rotation\n  r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c);\n  r[1] = p[1];\n  r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c);\n\n  //translate to correct position\n  out[0] = r[0] + b[0];\n  out[1] = r[1] + b[1];\n  out[2] = r[2] + b[2];\n\n  return out;\n}\n\n/**\n * Rotate a 3D vector around the z-axis\n * @param {vec3} out The receiving vec3\n * @param {vec3} a The vec3 point to rotate\n * @param {vec3} b The origin of the rotation\n * @param {Number} c The angle of rotation\n * @returns {vec3} out\n */\nfunction rotateZ(out, a, b, c) {\n  var p = [],\n      r = [];\n  //Translate point to the origin\n  p[0] = a[0] - b[0];\n  p[1] = a[1] - b[1];\n  p[2] = a[2] - b[2];\n\n  //perform rotation\n  r[0] = p[0] * Math.cos(c) - p[1] * Math.sin(c);\n  r[1] = p[0] * Math.sin(c) + p[1] * Math.cos(c);\n  r[2] = p[2];\n\n  //translate to correct position\n  out[0] = r[0] + b[0];\n  out[1] = r[1] + b[1];\n  out[2] = r[2] + b[2];\n\n  return out;\n}\n\n/**\n * Get the angle between two 3D vectors\n * @param {vec3} a The first operand\n * @param {vec3} b The second operand\n * @returns {Number} The angle in radians\n */\nfunction angle(a, b) {\n  var tempA = fromValues(a[0], a[1], a[2]);\n  var tempB = fromValues(b[0], b[1], b[2]);\n\n  normalize(tempA, tempA);\n  normalize(tempB, tempB);\n\n  var cosine = dot(tempA, tempB);\n\n  if (cosine > 1.0) {\n    return 0;\n  } else if (cosine < -1.0) {\n    return Math.PI;\n  } else {\n    return Math.acos(cosine);\n  }\n}\n\n/**\n * Returns a string representation of a vector\n *\n * @param {vec3} a vector to represent as a string\n * @returns {String} string representation of the vector\n */\nfunction str(a) {\n  return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';\n}\n\n/**\n * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)\n *\n * @param {vec3} a The first vector.\n * @param {vec3} b The second vector.\n * @returns {Boolean} True if the vectors are equal, false otherwise.\n */\nfunction exactEquals(a, b) {\n  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];\n}\n\n/**\n * Returns whether or not the vectors have approximately the same elements in the same position.\n *\n * @param {vec3} a The first vector.\n * @param {vec3} b The second vector.\n * @returns {Boolean} True if the vectors are equal, false otherwise.\n */\nfunction equals(a, b) {\n  var a0 = a[0],\n      a1 = a[1],\n      a2 = a[2];\n  var b0 = b[0],\n      b1 = b[1],\n      b2 = b[2];\n  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2));\n}\n\n/**\n * Alias for {@link vec3.subtract}\n * @function\n */\nvar sub = exports.sub = subtract;\n\n/**\n * Alias for {@link vec3.multiply}\n * @function\n */\nvar mul = exports.mul = multiply;\n\n/**\n * Alias for {@link vec3.divide}\n * @function\n */\nvar div = exports.div = divide;\n\n/**\n * Alias for {@link vec3.distance}\n * @function\n */\nvar dist = exports.dist = distance;\n\n/**\n * Alias for {@link vec3.squaredDistance}\n * @function\n */\nvar sqrDist = exports.sqrDist = squaredDistance;\n\n/**\n * Alias for {@link vec3.length}\n * @function\n */\nvar len = exports.len = length;\n\n/**\n * Alias for {@link vec3.squaredLength}\n * @function\n */\nvar sqrLen = exports.sqrLen = squaredLength;\n\n/**\n * Perform some operation over an array of vec3s.\n *\n * @param {Array} a the array of vectors to iterate over\n * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed\n * @param {Number} offset Number of elements to skip at the beginning of the array\n * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array\n * @param {Function} fn Function to call for each vector in the array\n * @param {Object} [arg] additional argument to pass to fn\n * @returns {Array} a\n * @function\n */\nvar forEach = exports.forEach = function () {\n  var vec = create();\n\n  return function (a, stride, offset, count, fn, arg) {\n    var i = void 0,\n        l = void 0;\n    if (!stride) {\n      stride = 3;\n    }\n\n    if (!offset) {\n      offset = 0;\n    }\n\n    if (count) {\n      l = Math.min(count * stride + offset, a.length);\n    } else {\n      l = a.length;\n    }\n\n    for (i = offset; i < l; i += stride) {\n      vec[0] = a[i];vec[1] = a[i + 1];vec[2] = a[i + 2];\n      fn(vec, vec, arg);\n      a[i] = vec[0];a[i + 1] = vec[1];a[i + 2] = vec[2];\n    }\n\n    return a;\n  };\n}();\n\n//# sourceURL=webpack:///./src/gl-matrix/vec3.js?");

            /***/
          },

          /***/"./src/gl-matrix/vec4.js":
          /*!*******************************!*\
            !*** ./src/gl-matrix/vec4.js ***!
            \*******************************/
          /*! no static exports found */
          /***/function srcGlMatrixVec4Js(module, exports, __webpack_require__) {

            "use strict";

            eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.forEach = exports.sqrLen = exports.len = exports.sqrDist = exports.dist = exports.div = exports.mul = exports.sub = undefined;\nexports.create = create;\nexports.clone = clone;\nexports.fromValues = fromValues;\nexports.copy = copy;\nexports.set = set;\nexports.add = add;\nexports.subtract = subtract;\nexports.multiply = multiply;\nexports.divide = divide;\nexports.ceil = ceil;\nexports.floor = floor;\nexports.min = min;\nexports.max = max;\nexports.round = round;\nexports.scale = scale;\nexports.scaleAndAdd = scaleAndAdd;\nexports.distance = distance;\nexports.squaredDistance = squaredDistance;\nexports.length = length;\nexports.squaredLength = squaredLength;\nexports.negate = negate;\nexports.inverse = inverse;\nexports.normalize = normalize;\nexports.dot = dot;\nexports.lerp = lerp;\nexports.random = random;\nexports.transformMat4 = transformMat4;\nexports.transformQuat = transformQuat;\nexports.str = str;\nexports.exactEquals = exactEquals;\nexports.equals = equals;\n\nvar _common = __webpack_require__(/*! ./common.js */ \"./src/gl-matrix/common.js\");\n\nvar glMatrix = _interopRequireWildcard(_common);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\n/**\n * 4 Dimensional Vector\n * @module vec4\n */\n\n/**\n * Creates a new, empty vec4\n *\n * @returns {vec4} a new 4D vector\n */\nfunction create() {\n  var out = new glMatrix.ARRAY_TYPE(4);\n  out[0] = 0;\n  out[1] = 0;\n  out[2] = 0;\n  out[3] = 0;\n  return out;\n}\n\n/**\n * Creates a new vec4 initialized with values from an existing vector\n *\n * @param {vec4} a vector to clone\n * @returns {vec4} a new 4D vector\n */\nfunction clone(a) {\n  var out = new glMatrix.ARRAY_TYPE(4);\n  out[0] = a[0];\n  out[1] = a[1];\n  out[2] = a[2];\n  out[3] = a[3];\n  return out;\n}\n\n/**\n * Creates a new vec4 initialized with the given values\n *\n * @param {Number} x X component\n * @param {Number} y Y component\n * @param {Number} z Z component\n * @param {Number} w W component\n * @returns {vec4} a new 4D vector\n */\nfunction fromValues(x, y, z, w) {\n  var out = new glMatrix.ARRAY_TYPE(4);\n  out[0] = x;\n  out[1] = y;\n  out[2] = z;\n  out[3] = w;\n  return out;\n}\n\n/**\n * Copy the values from one vec4 to another\n *\n * @param {vec4} out the receiving vector\n * @param {vec4} a the source vector\n * @returns {vec4} out\n */\nfunction copy(out, a) {\n  out[0] = a[0];\n  out[1] = a[1];\n  out[2] = a[2];\n  out[3] = a[3];\n  return out;\n}\n\n/**\n * Set the components of a vec4 to the given values\n *\n * @param {vec4} out the receiving vector\n * @param {Number} x X component\n * @param {Number} y Y component\n * @param {Number} z Z component\n * @param {Number} w W component\n * @returns {vec4} out\n */\nfunction set(out, x, y, z, w) {\n  out[0] = x;\n  out[1] = y;\n  out[2] = z;\n  out[3] = w;\n  return out;\n}\n\n/**\n * Adds two vec4's\n *\n * @param {vec4} out the receiving vector\n * @param {vec4} a the first operand\n * @param {vec4} b the second operand\n * @returns {vec4} out\n */\nfunction add(out, a, b) {\n  out[0] = a[0] + b[0];\n  out[1] = a[1] + b[1];\n  out[2] = a[2] + b[2];\n  out[3] = a[3] + b[3];\n  return out;\n}\n\n/**\n * Subtracts vector b from vector a\n *\n * @param {vec4} out the receiving vector\n * @param {vec4} a the first operand\n * @param {vec4} b the second operand\n * @returns {vec4} out\n */\nfunction subtract(out, a, b) {\n  out[0] = a[0] - b[0];\n  out[1] = a[1] - b[1];\n  out[2] = a[2] - b[2];\n  out[3] = a[3] - b[3];\n  return out;\n}\n\n/**\n * Multiplies two vec4's\n *\n * @param {vec4} out the receiving vector\n * @param {vec4} a the first operand\n * @param {vec4} b the second operand\n * @returns {vec4} out\n */\nfunction multiply(out, a, b) {\n  out[0] = a[0] * b[0];\n  out[1] = a[1] * b[1];\n  out[2] = a[2] * b[2];\n  out[3] = a[3] * b[3];\n  return out;\n}\n\n/**\n * Divides two vec4's\n *\n * @param {vec4} out the receiving vector\n * @param {vec4} a the first operand\n * @param {vec4} b the second operand\n * @returns {vec4} out\n */\nfunction divide(out, a, b) {\n  out[0] = a[0] / b[0];\n  out[1] = a[1] / b[1];\n  out[2] = a[2] / b[2];\n  out[3] = a[3] / b[3];\n  return out;\n}\n\n/**\n * Math.ceil the components of a vec4\n *\n * @param {vec4} out the receiving vector\n * @param {vec4} a vector to ceil\n * @returns {vec4} out\n */\nfunction ceil(out, a) {\n  out[0] = Math.ceil(a[0]);\n  out[1] = Math.ceil(a[1]);\n  out[2] = Math.ceil(a[2]);\n  out[3] = Math.ceil(a[3]);\n  return out;\n}\n\n/**\n * Math.floor the components of a vec4\n *\n * @param {vec4} out the receiving vector\n * @param {vec4} a vector to floor\n * @returns {vec4} out\n */\nfunction floor(out, a) {\n  out[0] = Math.floor(a[0]);\n  out[1] = Math.floor(a[1]);\n  out[2] = Math.floor(a[2]);\n  out[3] = Math.floor(a[3]);\n  return out;\n}\n\n/**\n * Returns the minimum of two vec4's\n *\n * @param {vec4} out the receiving vector\n * @param {vec4} a the first operand\n * @param {vec4} b the second operand\n * @returns {vec4} out\n */\nfunction min(out, a, b) {\n  out[0] = Math.min(a[0], b[0]);\n  out[1] = Math.min(a[1], b[1]);\n  out[2] = Math.min(a[2], b[2]);\n  out[3] = Math.min(a[3], b[3]);\n  return out;\n}\n\n/**\n * Returns the maximum of two vec4's\n *\n * @param {vec4} out the receiving vector\n * @param {vec4} a the first operand\n * @param {vec4} b the second operand\n * @returns {vec4} out\n */\nfunction max(out, a, b) {\n  out[0] = Math.max(a[0], b[0]);\n  out[1] = Math.max(a[1], b[1]);\n  out[2] = Math.max(a[2], b[2]);\n  out[3] = Math.max(a[3], b[3]);\n  return out;\n}\n\n/**\n * Math.round the components of a vec4\n *\n * @param {vec4} out the receiving vector\n * @param {vec4} a vector to round\n * @returns {vec4} out\n */\nfunction round(out, a) {\n  out[0] = Math.round(a[0]);\n  out[1] = Math.round(a[1]);\n  out[2] = Math.round(a[2]);\n  out[3] = Math.round(a[3]);\n  return out;\n}\n\n/**\n * Scales a vec4 by a scalar number\n *\n * @param {vec4} out the receiving vector\n * @param {vec4} a the vector to scale\n * @param {Number} b amount to scale the vector by\n * @returns {vec4} out\n */\nfunction scale(out, a, b) {\n  out[0] = a[0] * b;\n  out[1] = a[1] * b;\n  out[2] = a[2] * b;\n  out[3] = a[3] * b;\n  return out;\n}\n\n/**\n * Adds two vec4's after scaling the second operand by a scalar value\n *\n * @param {vec4} out the receiving vector\n * @param {vec4} a the first operand\n * @param {vec4} b the second operand\n * @param {Number} scale the amount to scale b by before adding\n * @returns {vec4} out\n */\nfunction scaleAndAdd(out, a, b, scale) {\n  out[0] = a[0] + b[0] * scale;\n  out[1] = a[1] + b[1] * scale;\n  out[2] = a[2] + b[2] * scale;\n  out[3] = a[3] + b[3] * scale;\n  return out;\n}\n\n/**\n * Calculates the euclidian distance between two vec4's\n *\n * @param {vec4} a the first operand\n * @param {vec4} b the second operand\n * @returns {Number} distance between a and b\n */\nfunction distance(a, b) {\n  var x = b[0] - a[0];\n  var y = b[1] - a[1];\n  var z = b[2] - a[2];\n  var w = b[3] - a[3];\n  return Math.sqrt(x * x + y * y + z * z + w * w);\n}\n\n/**\n * Calculates the squared euclidian distance between two vec4's\n *\n * @param {vec4} a the first operand\n * @param {vec4} b the second operand\n * @returns {Number} squared distance between a and b\n */\nfunction squaredDistance(a, b) {\n  var x = b[0] - a[0];\n  var y = b[1] - a[1];\n  var z = b[2] - a[2];\n  var w = b[3] - a[3];\n  return x * x + y * y + z * z + w * w;\n}\n\n/**\n * Calculates the length of a vec4\n *\n * @param {vec4} a vector to calculate length of\n * @returns {Number} length of a\n */\nfunction length(a) {\n  var x = a[0];\n  var y = a[1];\n  var z = a[2];\n  var w = a[3];\n  return Math.sqrt(x * x + y * y + z * z + w * w);\n}\n\n/**\n * Calculates the squared length of a vec4\n *\n * @param {vec4} a vector to calculate squared length of\n * @returns {Number} squared length of a\n */\nfunction squaredLength(a) {\n  var x = a[0];\n  var y = a[1];\n  var z = a[2];\n  var w = a[3];\n  return x * x + y * y + z * z + w * w;\n}\n\n/**\n * Negates the components of a vec4\n *\n * @param {vec4} out the receiving vector\n * @param {vec4} a vector to negate\n * @returns {vec4} out\n */\nfunction negate(out, a) {\n  out[0] = -a[0];\n  out[1] = -a[1];\n  out[2] = -a[2];\n  out[3] = -a[3];\n  return out;\n}\n\n/**\n * Returns the inverse of the components of a vec4\n *\n * @param {vec4} out the receiving vector\n * @param {vec4} a vector to invert\n * @returns {vec4} out\n */\nfunction inverse(out, a) {\n  out[0] = 1.0 / a[0];\n  out[1] = 1.0 / a[1];\n  out[2] = 1.0 / a[2];\n  out[3] = 1.0 / a[3];\n  return out;\n}\n\n/**\n * Normalize a vec4\n *\n * @param {vec4} out the receiving vector\n * @param {vec4} a vector to normalize\n * @returns {vec4} out\n */\nfunction normalize(out, a) {\n  var x = a[0];\n  var y = a[1];\n  var z = a[2];\n  var w = a[3];\n  var len = x * x + y * y + z * z + w * w;\n  if (len > 0) {\n    len = 1 / Math.sqrt(len);\n    out[0] = x * len;\n    out[1] = y * len;\n    out[2] = z * len;\n    out[3] = w * len;\n  }\n  return out;\n}\n\n/**\n * Calculates the dot product of two vec4's\n *\n * @param {vec4} a the first operand\n * @param {vec4} b the second operand\n * @returns {Number} dot product of a and b\n */\nfunction dot(a, b) {\n  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];\n}\n\n/**\n * Performs a linear interpolation between two vec4's\n *\n * @param {vec4} out the receiving vector\n * @param {vec4} a the first operand\n * @param {vec4} b the second operand\n * @param {Number} t interpolation amount, in the range [0-1], between the two inputs\n * @returns {vec4} out\n */\nfunction lerp(out, a, b, t) {\n  var ax = a[0];\n  var ay = a[1];\n  var az = a[2];\n  var aw = a[3];\n  out[0] = ax + t * (b[0] - ax);\n  out[1] = ay + t * (b[1] - ay);\n  out[2] = az + t * (b[2] - az);\n  out[3] = aw + t * (b[3] - aw);\n  return out;\n}\n\n/**\n * Generates a random vector with the given scale\n *\n * @param {vec4} out the receiving vector\n * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned\n * @returns {vec4} out\n */\nfunction random(out, vectorScale) {\n  vectorScale = vectorScale || 1.0;\n\n  // Marsaglia, George. Choosing a Point from the Surface of a\n  // Sphere. Ann. Math. Statist. 43 (1972), no. 2, 645--646.\n  // http://projecteuclid.org/euclid.aoms/1177692644;\n  var v1, v2, v3, v4;\n  var s1, s2;\n  do {\n    v1 = glMatrix.RANDOM() * 2 - 1;\n    v2 = glMatrix.RANDOM() * 2 - 1;\n    s1 = v1 * v1 + v2 * v2;\n  } while (s1 >= 1);\n  do {\n    v3 = glMatrix.RANDOM() * 2 - 1;\n    v4 = glMatrix.RANDOM() * 2 - 1;\n    s2 = v3 * v3 + v4 * v4;\n  } while (s2 >= 1);\n\n  var d = Math.sqrt((1 - s1) / s2);\n  out[0] = scale * v1;\n  out[1] = scale * v2;\n  out[2] = scale * v3 * d;\n  out[3] = scale * v4 * d;\n  return out;\n}\n\n/**\n * Transforms the vec4 with a mat4.\n *\n * @param {vec4} out the receiving vector\n * @param {vec4} a the vector to transform\n * @param {mat4} m matrix to transform with\n * @returns {vec4} out\n */\nfunction transformMat4(out, a, m) {\n  var x = a[0],\n      y = a[1],\n      z = a[2],\n      w = a[3];\n  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;\n  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;\n  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;\n  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;\n  return out;\n}\n\n/**\n * Transforms the vec4 with a quat\n *\n * @param {vec4} out the receiving vector\n * @param {vec4} a the vector to transform\n * @param {quat} q quaternion to transform with\n * @returns {vec4} out\n */\nfunction transformQuat(out, a, q) {\n  var x = a[0],\n      y = a[1],\n      z = a[2];\n  var qx = q[0],\n      qy = q[1],\n      qz = q[2],\n      qw = q[3];\n\n  // calculate quat * vec\n  var ix = qw * x + qy * z - qz * y;\n  var iy = qw * y + qz * x - qx * z;\n  var iz = qw * z + qx * y - qy * x;\n  var iw = -qx * x - qy * y - qz * z;\n\n  // calculate result * inverse quat\n  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;\n  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;\n  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;\n  out[3] = a[3];\n  return out;\n}\n\n/**\n * Returns a string representation of a vector\n *\n * @param {vec4} a vector to represent as a string\n * @returns {String} string representation of the vector\n */\nfunction str(a) {\n  return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';\n}\n\n/**\n * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)\n *\n * @param {vec4} a The first vector.\n * @param {vec4} b The second vector.\n * @returns {Boolean} True if the vectors are equal, false otherwise.\n */\nfunction exactEquals(a, b) {\n  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];\n}\n\n/**\n * Returns whether or not the vectors have approximately the same elements in the same position.\n *\n * @param {vec4} a The first vector.\n * @param {vec4} b The second vector.\n * @returns {Boolean} True if the vectors are equal, false otherwise.\n */\nfunction equals(a, b) {\n  var a0 = a[0],\n      a1 = a[1],\n      a2 = a[2],\n      a3 = a[3];\n  var b0 = b[0],\n      b1 = b[1],\n      b2 = b[2],\n      b3 = b[3];\n  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));\n}\n\n/**\n * Alias for {@link vec4.subtract}\n * @function\n */\nvar sub = exports.sub = subtract;\n\n/**\n * Alias for {@link vec4.multiply}\n * @function\n */\nvar mul = exports.mul = multiply;\n\n/**\n * Alias for {@link vec4.divide}\n * @function\n */\nvar div = exports.div = divide;\n\n/**\n * Alias for {@link vec4.distance}\n * @function\n */\nvar dist = exports.dist = distance;\n\n/**\n * Alias for {@link vec4.squaredDistance}\n * @function\n */\nvar sqrDist = exports.sqrDist = squaredDistance;\n\n/**\n * Alias for {@link vec4.length}\n * @function\n */\nvar len = exports.len = length;\n\n/**\n * Alias for {@link vec4.squaredLength}\n * @function\n */\nvar sqrLen = exports.sqrLen = squaredLength;\n\n/**\n * Perform some operation over an array of vec4s.\n *\n * @param {Array} a the array of vectors to iterate over\n * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed\n * @param {Number} offset Number of elements to skip at the beginning of the array\n * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array\n * @param {Function} fn Function to call for each vector in the array\n * @param {Object} [arg] additional argument to pass to fn\n * @returns {Array} a\n * @function\n */\nvar forEach = exports.forEach = function () {\n  var vec = create();\n\n  return function (a, stride, offset, count, fn, arg) {\n    var i = void 0,\n        l = void 0;\n    if (!stride) {\n      stride = 4;\n    }\n\n    if (!offset) {\n      offset = 0;\n    }\n\n    if (count) {\n      l = Math.min(count * stride + offset, a.length);\n    } else {\n      l = a.length;\n    }\n\n    for (i = offset; i < l; i += stride) {\n      vec[0] = a[i];vec[1] = a[i + 1];vec[2] = a[i + 2];vec[3] = a[i + 3];\n      fn(vec, vec, arg);\n      a[i] = vec[0];a[i + 1] = vec[1];a[i + 2] = vec[2];a[i + 3] = vec[3];\n    }\n\n    return a;\n  };\n}();\n\n//# sourceURL=webpack:///./src/gl-matrix/vec4.js?");

            /***/
          }

          /******/ })
      );
    });
  }, {}], 54: [function (require, module, exports) {
    var canPromise = require('can-promise');
    var QRCode = require('./core/qrcode');
    var CanvasRenderer = require('./renderer/canvas');
    var SvgRenderer = require('./renderer/svg-tag.js');

    function renderCanvas(renderFunc, canvas, text, opts, cb) {
      var args = [].slice.call(arguments, 1);
      var argsNum = args.length;
      var isLastArgCb = typeof args[argsNum - 1] === 'function';

      if (!isLastArgCb && !canPromise()) {
        throw new Error('Callback required as last argument');
      }

      if (isLastArgCb) {
        if (argsNum < 2) {
          throw new Error('Too few arguments provided');
        }

        if (argsNum === 2) {
          cb = text;
          text = canvas;
          canvas = opts = undefined;
        } else if (argsNum === 3) {
          if (canvas.getContext && typeof cb === 'undefined') {
            cb = opts;
            opts = undefined;
          } else {
            cb = opts;
            opts = text;
            text = canvas;
            canvas = undefined;
          }
        }
      } else {
        if (argsNum < 1) {
          throw new Error('Too few arguments provided');
        }

        if (argsNum === 1) {
          text = canvas;
          canvas = opts = undefined;
        } else if (argsNum === 2 && !canvas.getContext) {
          opts = text;
          text = canvas;
          canvas = undefined;
        }

        return new Promise(function (resolve, reject) {
          try {
            var data = QRCode.create(text, opts);
            resolve(renderFunc(data, canvas, opts));
          } catch (e) {
            reject(e);
          }
        });
      }

      try {
        var data = QRCode.create(text, opts);
        cb(null, renderFunc(data, canvas, opts));
      } catch (e) {
        cb(e);
      }
    }

    exports.create = QRCode.create;
    exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
    exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);

    // only svg for now.
    exports.toString = renderCanvas.bind(null, function (data, _, opts) {
      return SvgRenderer.render(data, opts);
    });
  }, { "./core/qrcode": 70, "./renderer/canvas": 76, "./renderer/svg-tag.js": 77, "can-promise": 51 }], 55: [function (require, module, exports) {
    /**
     * Alignment pattern are fixed reference pattern in defined positions
     * in a matrix symbology, which enables the decode software to re-synchronise
     * the coordinate mapping of the image modules in the event of moderate amounts
     * of distortion of the image.
     *
     * Alignment patterns are present only in QR Code symbols of version 2 or larger
     * and their number depends on the symbol version.
     */

    var getSymbolSize = require('./utils').getSymbolSize;

    /**
     * Calculate the row/column coordinates of the center module of each alignment pattern
     * for the specified QR Code version.
     *
     * The alignment patterns are positioned symmetrically on either side of the diagonal
     * running from the top left corner of the symbol to the bottom right corner.
     *
     * Since positions are simmetrical only half of the coordinates are returned.
     * Each item of the array will represent in turn the x and y coordinate.
     * @see {@link getPositions}
     *
     * @param  {Number} version QR Code version
     * @return {Array}          Array of coordinate
     */
    exports.getRowColCoords = function getRowColCoords(version) {
      if (version === 1) return [];

      var posCount = Math.floor(version / 7) + 2;
      var size = getSymbolSize(version);
      var intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
      var positions = [size - 7]; // Last coord is always (size - 7)

      for (var i = 1; i < posCount - 1; i++) {
        positions[i] = positions[i - 1] - intervals;
      }

      positions.push(6); // First coord is always 6

      return positions.reverse();
    };

    /**
     * Returns an array containing the positions of each alignment pattern.
     * Each array's element represent the center point of the pattern as (x, y) coordinates
     *
     * Coordinates are calculated expanding the row/column coordinates returned by {@link getRowColCoords}
     * and filtering out the items that overlaps with finder pattern
     *
     * @example
     * For a Version 7 symbol {@link getRowColCoords} returns values 6, 22 and 38.
     * The alignment patterns, therefore, are to be centered on (row, column)
     * positions (6,22), (22,6), (22,22), (22,38), (38,22), (38,38).
     * Note that the coordinates (6,6), (6,38), (38,6) are occupied by finder patterns
     * and are not therefore used for alignment patterns.
     *
     * var pos = getPositions(7)
     * // [[6,22], [22,6], [22,22], [22,38], [38,22], [38,38]]
     *
     * @param  {Number} version QR Code version
     * @return {Array}          Array of coordinates
     */
    exports.getPositions = function getPositions(version) {
      var coords = [];
      var pos = exports.getRowColCoords(version);
      var posLength = pos.length;

      for (var i = 0; i < posLength; i++) {
        for (var j = 0; j < posLength; j++) {
          // Skip if position is occupied by finder patterns
          if (i === 0 && j === 0 || // top-left
          i === 0 && j === posLength - 1 || // bottom-left
          i === posLength - 1 && j === 0) {
            // top-right
            continue;
          }

          coords.push([pos[i], pos[j]]);
        }
      }

      return coords;
    };
  }, { "./utils": 74 }], 56: [function (require, module, exports) {
    var Mode = require('./mode');

    /**
     * Array of characters available in alphanumeric mode
     *
     * As per QR Code specification, to each character
     * is assigned a value from 0 to 44 which in this case coincides
     * with the array index
     *
     * @type {Array}
     */
    var ALPHA_NUM_CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' ', '$', '%', '*', '+', '-', '.', '/', ':'];

    function AlphanumericData(data) {
      this.mode = Mode.ALPHANUMERIC;
      this.data = data;
    }

    AlphanumericData.getBitsLength = function getBitsLength(length) {
      return 11 * Math.floor(length / 2) + 6 * (length % 2);
    };

    AlphanumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };

    AlphanumericData.prototype.getBitsLength = function getBitsLength() {
      return AlphanumericData.getBitsLength(this.data.length);
    };

    AlphanumericData.prototype.write = function write(bitBuffer) {
      var i;

      // Input data characters are divided into groups of two characters
      // and encoded as 11-bit binary codes.
      for (i = 0; i + 2 <= this.data.length; i += 2) {
        // The character value of the first character is multiplied by 45
        var value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;

        // The character value of the second digit is added to the product
        value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);

        // The sum is then stored as 11-bit binary number
        bitBuffer.put(value, 11);
      }

      // If the number of input data characters is not a multiple of two,
      // the character value of the final character is encoded as a 6-bit binary number.
      if (this.data.length % 2) {
        bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
      }
    };

    module.exports = AlphanumericData;
  }, { "./mode": 67 }], 57: [function (require, module, exports) {
    function BitBuffer() {
      this.buffer = [];
      this.length = 0;
    }

    BitBuffer.prototype = {

      get: function get(index) {
        var bufIndex = Math.floor(index / 8);
        return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
      },

      put: function put(num, length) {
        for (var i = 0; i < length; i++) {
          this.putBit((num >>> length - i - 1 & 1) === 1);
        }
      },

      getLengthInBits: function getLengthInBits() {
        return this.length;
      },

      putBit: function putBit(bit) {
        var bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }

        if (bit) {
          this.buffer[bufIndex] |= 0x80 >>> this.length % 8;
        }

        this.length++;
      }
    };

    module.exports = BitBuffer;
  }, {}], 58: [function (require, module, exports) {
    var Buffer = require('../utils/buffer');

    /**
     * Helper class to handle QR Code symbol modules
     *
     * @param {Number} size Symbol size
     */
    function BitMatrix(size) {
      if (!size || size < 1) {
        throw new Error('BitMatrix size must be defined and greater than 0');
      }

      this.size = size;
      this.data = new Buffer(size * size);
      this.data.fill(0);
      this.reservedBit = new Buffer(size * size);
      this.reservedBit.fill(0);
    }

    /**
     * Set bit value at specified location
     * If reserved flag is set, this bit will be ignored during masking process
     *
     * @param {Number}  row
     * @param {Number}  col
     * @param {Boolean} value
     * @param {Boolean} reserved
     */
    BitMatrix.prototype.set = function (row, col, value, reserved) {
      var index = row * this.size + col;
      this.data[index] = value;
      if (reserved) this.reservedBit[index] = true;
    };

    /**
     * Returns bit value at specified location
     *
     * @param  {Number}  row
     * @param  {Number}  col
     * @return {Boolean}
     */
    BitMatrix.prototype.get = function (row, col) {
      return this.data[row * this.size + col];
    };

    /**
     * Applies xor operator at specified location
     * (used during masking process)
     *
     * @param {Number}  row
     * @param {Number}  col
     * @param {Boolean} value
     */
    BitMatrix.prototype.xor = function (row, col, value) {
      this.data[row * this.size + col] ^= value;
    };

    /**
     * Check if bit at specified location is reserved
     *
     * @param {Number}   row
     * @param {Number}   col
     * @return {Boolean}
     */
    BitMatrix.prototype.isReserved = function (row, col) {
      return this.reservedBit[row * this.size + col];
    };

    module.exports = BitMatrix;
  }, { "../utils/buffer": 79 }], 59: [function (require, module, exports) {
    var Buffer = require('../utils/buffer');
    var Mode = require('./mode');

    function ByteData(data) {
      this.mode = Mode.BYTE;
      this.data = new Buffer(data);
    }

    ByteData.getBitsLength = function getBitsLength(length) {
      return length * 8;
    };

    ByteData.prototype.getLength = function getLength() {
      return this.data.length;
    };

    ByteData.prototype.getBitsLength = function getBitsLength() {
      return ByteData.getBitsLength(this.data.length);
    };

    ByteData.prototype.write = function (bitBuffer) {
      for (var i = 0, l = this.data.length; i < l; i++) {
        bitBuffer.put(this.data[i], 8);
      }
    };

    module.exports = ByteData;
  }, { "../utils/buffer": 79, "./mode": 67 }], 60: [function (require, module, exports) {
    var ECLevel = require('./error-correction-level');

    var EC_BLOCKS_TABLE = [
    // L  M  Q  H
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 4, 1, 2, 4, 4, 2, 4, 4, 4, 2, 4, 6, 5, 2, 4, 6, 6, 2, 5, 8, 8, 4, 5, 8, 8, 4, 5, 8, 11, 4, 8, 10, 11, 4, 9, 12, 16, 4, 9, 16, 16, 6, 10, 12, 18, 6, 10, 17, 16, 6, 11, 16, 19, 6, 13, 18, 21, 7, 14, 21, 25, 8, 16, 20, 25, 8, 17, 23, 25, 9, 17, 23, 34, 9, 18, 25, 30, 10, 20, 27, 32, 12, 21, 29, 35, 12, 23, 34, 37, 12, 25, 34, 40, 13, 26, 35, 42, 14, 28, 38, 45, 15, 29, 40, 48, 16, 31, 43, 51, 17, 33, 45, 54, 18, 35, 48, 57, 19, 37, 51, 60, 19, 38, 53, 63, 20, 40, 56, 66, 21, 43, 59, 70, 22, 45, 62, 74, 24, 47, 65, 77, 25, 49, 68, 81];

    var EC_CODEWORDS_TABLE = [
    // L  M  Q  H
    7, 10, 13, 17, 10, 16, 22, 28, 15, 26, 36, 44, 20, 36, 52, 64, 26, 48, 72, 88, 36, 64, 96, 112, 40, 72, 108, 130, 48, 88, 132, 156, 60, 110, 160, 192, 72, 130, 192, 224, 80, 150, 224, 264, 96, 176, 260, 308, 104, 198, 288, 352, 120, 216, 320, 384, 132, 240, 360, 432, 144, 280, 408, 480, 168, 308, 448, 532, 180, 338, 504, 588, 196, 364, 546, 650, 224, 416, 600, 700, 224, 442, 644, 750, 252, 476, 690, 816, 270, 504, 750, 900, 300, 560, 810, 960, 312, 588, 870, 1050, 336, 644, 952, 1110, 360, 700, 1020, 1200, 390, 728, 1050, 1260, 420, 784, 1140, 1350, 450, 812, 1200, 1440, 480, 868, 1290, 1530, 510, 924, 1350, 1620, 540, 980, 1440, 1710, 570, 1036, 1530, 1800, 570, 1064, 1590, 1890, 600, 1120, 1680, 1980, 630, 1204, 1770, 2100, 660, 1260, 1860, 2220, 720, 1316, 1950, 2310, 750, 1372, 2040, 2430];

    /**
     * Returns the number of error correction block that the QR Code should contain
     * for the specified version and error correction level.
     *
     * @param  {Number} version              QR Code version
     * @param  {Number} errorCorrectionLevel Error correction level
     * @return {Number}                      Number of error correction blocks
     */
    exports.getBlocksCount = function getBlocksCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 3];
        default:
          return undefined;
      }
    };

    /**
     * Returns the number of error correction codewords to use for the specified
     * version and error correction level.
     *
     * @param  {Number} version              QR Code version
     * @param  {Number} errorCorrectionLevel Error correction level
     * @return {Number}                      Number of error correction codewords
     */
    exports.getTotalCodewordsCount = function getTotalCodewordsCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3];
        default:
          return undefined;
      }
    };
  }, { "./error-correction-level": 61 }], 61: [function (require, module, exports) {
    exports.L = { bit: 1 };
    exports.M = { bit: 0 };
    exports.Q = { bit: 3 };
    exports.H = { bit: 2 };

    function fromString(string) {
      if (typeof string !== 'string') {
        throw new Error('Param is not a string');
      }

      var lcStr = string.toLowerCase();

      switch (lcStr) {
        case 'l':
        case 'low':
          return exports.L;

        case 'm':
        case 'medium':
          return exports.M;

        case 'q':
        case 'quartile':
          return exports.Q;

        case 'h':
        case 'high':
          return exports.H;

        default:
          throw new Error('Unknown EC Level: ' + string);
      }
    }

    exports.isValid = function isValid(level) {
      return level && typeof level.bit !== 'undefined' && level.bit >= 0 && level.bit < 4;
    };

    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }

      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }, {}], 62: [function (require, module, exports) {
    var getSymbolSize = require('./utils').getSymbolSize;
    var FINDER_PATTERN_SIZE = 7;

    /**
     * Returns an array containing the positions of each finder pattern.
     * Each array's element represent the top-left point of the pattern as (x, y) coordinates
     *
     * @param  {Number} version QR Code version
     * @return {Array}          Array of coordinates
     */
    exports.getPositions = function getPositions(version) {
      var size = getSymbolSize(version);

      return [
      // top-left
      [0, 0],
      // top-right
      [size - FINDER_PATTERN_SIZE, 0],
      // bottom-left
      [0, size - FINDER_PATTERN_SIZE]];
    };
  }, { "./utils": 74 }], 63: [function (require, module, exports) {
    var Utils = require('./utils');

    var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
    var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
    var G15_BCH = Utils.getBCHDigit(G15);

    /**
     * Returns format information with relative error correction bits
     *
     * The format information is a 15-bit sequence containing 5 data bits,
     * with 10 error correction bits calculated using the (15, 5) BCH code.
     *
     * @param  {Number} errorCorrectionLevel Error correction level
     * @param  {Number} mask                 Mask pattern
     * @return {Number}                      Encoded format information bits
     */
    exports.getEncodedBits = function getEncodedBits(errorCorrectionLevel, mask) {
      var data = errorCorrectionLevel.bit << 3 | mask;
      var d = data << 10;

      while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
        d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
      }

      // xor final data with mask pattern in order to ensure that
      // no combination of Error Correction Level and data mask pattern
      // will result in an all-zero data string
      return (data << 10 | d) ^ G15_MASK;
    };
  }, { "./utils": 74 }], 64: [function (require, module, exports) {
    var Buffer = require('../utils/buffer');

    var EXP_TABLE = new Buffer(512);
    var LOG_TABLE = new Buffer(256)

    /**
     * Precompute the log and anti-log tables for faster computation later
     *
     * For each possible value in the galois field 2^8, we will pre-compute
     * the logarithm and anti-logarithm (exponential) of this value
     *
     * ref {@link https://en.wikiversity.org/wiki/Reed%E2%80%93Solomon_codes_for_coders#Introduction_to_mathematical_fields}
     */
    ;(function initTables() {
      var x = 1;
      for (var i = 0; i < 255; i++) {
        EXP_TABLE[i] = x;
        LOG_TABLE[x] = i;

        x <<= 1; // multiply by 2

        // The QR code specification says to use byte-wise modulo 100011101 arithmetic.
        // This means that when a number is 256 or larger, it should be XORed with 0x11D.
        if (x & 0x100) {
          // similar to x >= 256, but a lot faster (because 0x100 == 256)
          x ^= 0x11D;
        }
      }

      // Optimization: double the size of the anti-log table so that we don't need to mod 255 to
      // stay inside the bounds (because we will mainly use this table for the multiplication of
      // two GF numbers, no more).
      // @see {@link mul}
      for (i = 255; i < 512; i++) {
        EXP_TABLE[i] = EXP_TABLE[i - 255];
      }
    })();

    /**
     * Returns log value of n inside Galois Field
     *
     * @param  {Number} n
     * @return {Number}
     */
    exports.log = function log(n) {
      if (n < 1) throw new Error('log(' + n + ')');
      return LOG_TABLE[n];
    };

    /**
     * Returns anti-log value of n inside Galois Field
     *
     * @param  {Number} n
     * @return {Number}
     */
    exports.exp = function exp(n) {
      return EXP_TABLE[n];
    };

    /**
     * Multiplies two number inside Galois Field
     *
     * @param  {Number} x
     * @param  {Number} y
     * @return {Number}
     */
    exports.mul = function mul(x, y) {
      if (x === 0 || y === 0) return 0;

      // should be EXP_TABLE[(LOG_TABLE[x] + LOG_TABLE[y]) % 255] if EXP_TABLE wasn't oversized
      // @see {@link initTables}
      return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
    };
  }, { "../utils/buffer": 79 }], 65: [function (require, module, exports) {
    var Mode = require('./mode');
    var Utils = require('./utils');

    function KanjiData(data) {
      this.mode = Mode.KANJI;
      this.data = data;
    }

    KanjiData.getBitsLength = function getBitsLength(length) {
      return length * 13;
    };

    KanjiData.prototype.getLength = function getLength() {
      return this.data.length;
    };

    KanjiData.prototype.getBitsLength = function getBitsLength() {
      return KanjiData.getBitsLength(this.data.length);
    };

    KanjiData.prototype.write = function (bitBuffer) {
      var i;

      // In the Shift JIS system, Kanji characters are represented by a two byte combination.
      // These byte values are shifted from the JIS X 0208 values.
      // JIS X 0208 gives details of the shift coded representation.
      for (i = 0; i < this.data.length; i++) {
        var value = Utils.toSJIS(this.data[i]);

        // For characters with Shift JIS values from 0x8140 to 0x9FFC:
        if (value >= 0x8140 && value <= 0x9FFC) {
          // Subtract 0x8140 from Shift JIS value
          value -= 0x8140;

          // For characters with Shift JIS values from 0xE040 to 0xEBBF
        } else if (value >= 0xE040 && value <= 0xEBBF) {
          // Subtract 0xC140 from Shift JIS value
          value -= 0xC140;
        } else {
          throw new Error('Invalid SJIS character: ' + this.data[i] + '\n' + 'Make sure your charset is UTF-8');
        }

        // Multiply most significant byte of result by 0xC0
        // and add least significant byte to product
        value = (value >>> 8 & 0xff) * 0xC0 + (value & 0xff);

        // Convert result to a 13-bit binary string
        bitBuffer.put(value, 13);
      }
    };

    module.exports = KanjiData;
  }, { "./mode": 67, "./utils": 74 }], 66: [function (require, module, exports) {
    /**
     * Data mask pattern reference
     * @type {Object}
     */
    exports.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7

      /**
       * Weighted penalty scores for the undesirable features
       * @type {Object}
       */
    };var PenaltyScores = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10

      /**
       * Check if mask pattern value is valid
       *
       * @param  {Number}  mask    Mask pattern
       * @return {Boolean}         true if valid, false otherwise
       */
    };exports.isValid = function isValid(mask) {
      return mask && mask !== '' && !isNaN(mask) && mask >= 0 && mask <= 7;
    };

    /**
     * Returns mask pattern from a value.
     * If value is not valid, returns undefined
     *
     * @param  {Number|String} value        Mask pattern value
     * @return {Number}                     Valid mask pattern or undefined
     */
    exports.from = function from(value) {
      return exports.isValid(value) ? parseInt(value, 10) : undefined;
    };

    /**
    * Find adjacent modules in row/column with the same color
    * and assign a penalty value.
    *
    * Points: N1 + i
    * i is the amount by which the number of adjacent modules of the same color exceeds 5
    */
    exports.getPenaltyN1 = function getPenaltyN1(data) {
      var size = data.size;
      var points = 0;
      var sameCountCol = 0;
      var sameCountRow = 0;
      var lastCol = null;
      var lastRow = null;

      for (var row = 0; row < size; row++) {
        sameCountCol = sameCountRow = 0;
        lastCol = lastRow = null;

        for (var col = 0; col < size; col++) {
          var module = data.get(row, col);
          if (module === lastCol) {
            sameCountCol++;
          } else {
            if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
            lastCol = module;
            sameCountCol = 1;
          }

          module = data.get(col, row);
          if (module === lastRow) {
            sameCountRow++;
          } else {
            if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
            lastRow = module;
            sameCountRow = 1;
          }
        }

        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
      }

      return points;
    };

    /**
     * Find 2x2 blocks with the same color and assign a penalty value
     *
     * Points: N2 * (m - 1) * (n - 1)
     */
    exports.getPenaltyN2 = function getPenaltyN2(data) {
      var size = data.size;
      var points = 0;

      for (var row = 0; row < size - 1; row++) {
        for (var col = 0; col < size - 1; col++) {
          var last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);

          if (last === 4 || last === 0) points++;
        }
      }

      return points * PenaltyScores.N2;
    };

    /**
     * Find 1:1:3:1:1 ratio (dark:light:dark:light:dark) pattern in row/column,
     * preceded or followed by light area 4 modules wide
     *
     * Points: N3 * number of pattern found
     */
    exports.getPenaltyN3 = function getPenaltyN3(data) {
      var size = data.size;
      var points = 0;
      var bitsCol = 0;
      var bitsRow = 0;

      for (var row = 0; row < size; row++) {
        bitsCol = bitsRow = 0;
        for (var col = 0; col < size; col++) {
          bitsCol = bitsCol << 1 & 0x7FF | data.get(row, col);
          if (col >= 10 && (bitsCol === 0x5D0 || bitsCol === 0x05D)) points++;

          bitsRow = bitsRow << 1 & 0x7FF | data.get(col, row);
          if (col >= 10 && (bitsRow === 0x5D0 || bitsRow === 0x05D)) points++;
        }
      }

      return points * PenaltyScores.N3;
    };

    /**
     * Calculate proportion of dark modules in entire symbol
     *
     * Points: N4 * k
     *
     * k is the rating of the deviation of the proportion of dark modules
     * in the symbol from 50% in steps of 5%
     */
    exports.getPenaltyN4 = function getPenaltyN4(data) {
      var darkCount = 0;
      var modulesCount = data.data.length;

      for (var i = 0; i < modulesCount; i++) {
        darkCount += data.data[i];
      }var k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);

      return k * PenaltyScores.N4;
    };

    /**
     * Return mask value at given position
     *
     * @param  {Number} maskPattern Pattern reference value
     * @param  {Number} i           Row
     * @param  {Number} j           Column
     * @return {Boolean}            Mask value
     */
    function getMaskAt(maskPattern, i, j) {
      switch (maskPattern) {
        case exports.Patterns.PATTERN000:
          return (i + j) % 2 === 0;
        case exports.Patterns.PATTERN001:
          return i % 2 === 0;
        case exports.Patterns.PATTERN010:
          return j % 3 === 0;
        case exports.Patterns.PATTERN011:
          return (i + j) % 3 === 0;
        case exports.Patterns.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case exports.Patterns.PATTERN101:
          return i * j % 2 + i * j % 3 === 0;
        case exports.Patterns.PATTERN110:
          return (i * j % 2 + i * j % 3) % 2 === 0;
        case exports.Patterns.PATTERN111:
          return (i * j % 3 + (i + j) % 2) % 2 === 0;

        default:
          throw new Error('bad maskPattern:' + maskPattern);
      }
    }

    /**
     * Apply a mask pattern to a BitMatrix
     *
     * @param  {Number}    pattern Pattern reference number
     * @param  {BitMatrix} data    BitMatrix data
     */
    exports.applyMask = function applyMask(pattern, data) {
      var size = data.size;

      for (var col = 0; col < size; col++) {
        for (var row = 0; row < size; row++) {
          if (data.isReserved(row, col)) continue;
          data.xor(row, col, getMaskAt(pattern, row, col));
        }
      }
    };

    /**
     * Returns the best mask pattern for data
     *
     * @param  {BitMatrix} data
     * @return {Number} Mask pattern reference number
     */
    exports.getBestMask = function getBestMask(data, setupFormatFunc) {
      var numPatterns = Object.keys(exports.Patterns).length;
      var bestPattern = 0;
      var lowerPenalty = Infinity;

      for (var p = 0; p < numPatterns; p++) {
        setupFormatFunc(p);
        exports.applyMask(p, data);

        // Calculate penalty
        var penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);

        // Undo previously applied mask
        exports.applyMask(p, data);

        if (penalty < lowerPenalty) {
          lowerPenalty = penalty;
          bestPattern = p;
        }
      }

      return bestPattern;
    };
  }, {}], 67: [function (require, module, exports) {
    var Version = require('./version');
    var Regex = require('./regex');

    /**
     * Numeric mode encodes data from the decimal digit set (0 - 9)
     * (byte values 30HEX to 39HEX).
     * Normally, 3 data characters are represented by 10 bits.
     *
     * @type {Object}
     */
    exports.NUMERIC = {
      id: 'Numeric',
      bit: 1 << 0,
      ccBits: [10, 12, 14]

      /**
       * Alphanumeric mode encodes data from a set of 45 characters,
       * i.e. 10 numeric digits (0 - 9),
       *      26 alphabetic characters (A - Z),
       *   and 9 symbols (SP, $, %, *, +, -, ., /, :).
       * Normally, two input characters are represented by 11 bits.
       *
       * @type {Object}
       */
    };exports.ALPHANUMERIC = {
      id: 'Alphanumeric',
      bit: 1 << 1,
      ccBits: [9, 11, 13]

      /**
       * In byte mode, data is encoded at 8 bits per character.
       *
       * @type {Object}
       */
    };exports.BYTE = {
      id: 'Byte',
      bit: 1 << 2,
      ccBits: [8, 16, 16]

      /**
       * The Kanji mode efficiently encodes Kanji characters in accordance with
       * the Shift JIS system based on JIS X 0208.
       * The Shift JIS values are shifted from the JIS X 0208 values.
       * JIS X 0208 gives details of the shift coded representation.
       * Each two-byte character value is compacted to a 13-bit binary codeword.
       *
       * @type {Object}
       */
    };exports.KANJI = {
      id: 'Kanji',
      bit: 1 << 3,
      ccBits: [8, 10, 12]

      /**
       * Mixed mode will contain a sequences of data in a combination of any of
       * the modes described above
       *
       * @type {Object}
       */
    };exports.MIXED = {
      bit: -1

      /**
       * Returns the number of bits needed to store the data length
       * according to QR Code specifications.
       *
       * @param  {Mode}   mode    Data mode
       * @param  {Number} version QR Code version
       * @return {Number}         Number of bits
       */
    };exports.getCharCountIndicator = function getCharCountIndicator(mode, version) {
      if (!mode.ccBits) throw new Error('Invalid mode: ' + mode);

      if (!Version.isValid(version)) {
        throw new Error('Invalid version: ' + version);
      }

      if (version >= 1 && version < 10) return mode.ccBits[0];else if (version < 27) return mode.ccBits[1];
      return mode.ccBits[2];
    };

    /**
     * Returns the most efficient mode to store the specified data
     *
     * @param  {String} dataStr Input data string
     * @return {Mode}           Best mode
     */
    exports.getBestModeForData = function getBestModeForData(dataStr) {
      if (Regex.testNumeric(dataStr)) return exports.NUMERIC;else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;else if (Regex.testKanji(dataStr)) return exports.KANJI;else return exports.BYTE;
    };

    /**
     * Return mode name as string
     *
     * @param {Mode} mode Mode object
     * @returns {String}  Mode name
     */
    exports.toString = function toString(mode) {
      if (mode && mode.id) return mode.id;
      throw new Error('Invalid mode');
    };

    /**
     * Check if input param is a valid mode object
     *
     * @param   {Mode}    mode Mode object
     * @returns {Boolean} True if valid mode, false otherwise
     */
    exports.isValid = function isValid(mode) {
      return mode && mode.bit && mode.ccBits;
    };

    /**
     * Get mode object from its name
     *
     * @param   {String} string Mode name
     * @returns {Mode}          Mode object
     */
    function fromString(string) {
      if (typeof string !== 'string') {
        throw new Error('Param is not a string');
      }

      var lcStr = string.toLowerCase();

      switch (lcStr) {
        case 'numeric':
          return exports.NUMERIC;
        case 'alphanumeric':
          return exports.ALPHANUMERIC;
        case 'kanji':
          return exports.KANJI;
        case 'byte':
          return exports.BYTE;
        default:
          throw new Error('Unknown mode: ' + string);
      }
    }

    /**
     * Returns mode from a value.
     * If value is not a valid mode, returns defaultValue
     *
     * @param  {Mode|String} value        Encoding mode
     * @param  {Mode}        defaultValue Fallback value
     * @return {Mode}                     Encoding mode
     */
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }

      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }, { "./regex": 72, "./version": 75 }], 68: [function (require, module, exports) {
    var Mode = require('./mode');

    function NumericData(data) {
      this.mode = Mode.NUMERIC;
      this.data = data.toString();
    }

    NumericData.getBitsLength = function getBitsLength(length) {
      return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
    };

    NumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };

    NumericData.prototype.getBitsLength = function getBitsLength() {
      return NumericData.getBitsLength(this.data.length);
    };

    NumericData.prototype.write = function write(bitBuffer) {
      var i, group, value;

      // The input data string is divided into groups of three digits,
      // and each group is converted to its 10-bit binary equivalent.
      for (i = 0; i + 3 <= this.data.length; i += 3) {
        group = this.data.substr(i, 3);
        value = parseInt(group, 10);

        bitBuffer.put(value, 10);
      }

      // If the number of input digits is not an exact multiple of three,
      // the final one or two digits are converted to 4 or 7 bits respectively.
      var remainingNum = this.data.length - i;
      if (remainingNum > 0) {
        group = this.data.substr(i);
        value = parseInt(group, 10);

        bitBuffer.put(value, remainingNum * 3 + 1);
      }
    };

    module.exports = NumericData;
  }, { "./mode": 67 }], 69: [function (require, module, exports) {
    var Buffer = require('../utils/buffer');
    var GF = require('./galois-field');

    /**
     * Multiplies two polynomials inside Galois Field
     *
     * @param  {Buffer} p1 Polynomial
     * @param  {Buffer} p2 Polynomial
     * @return {Buffer}    Product of p1 and p2
     */
    exports.mul = function mul(p1, p2) {
      var coeff = new Buffer(p1.length + p2.length - 1);
      coeff.fill(0);

      for (var i = 0; i < p1.length; i++) {
        for (var j = 0; j < p2.length; j++) {
          coeff[i + j] ^= GF.mul(p1[i], p2[j]);
        }
      }

      return coeff;
    };

    /**
     * Calculate the remainder of polynomials division
     *
     * @param  {Buffer} divident Polynomial
     * @param  {Buffer} divisor  Polynomial
     * @return {Buffer}          Remainder
     */
    exports.mod = function mod(divident, divisor) {
      var result = new Buffer(divident);

      while (result.length - divisor.length >= 0) {
        var coeff = result[0];

        for (var i = 0; i < divisor.length; i++) {
          result[i] ^= GF.mul(divisor[i], coeff);
        }

        // remove all zeros from buffer head
        var offset = 0;
        while (offset < result.length && result[offset] === 0) {
          offset++;
        }result = result.slice(offset);
      }

      return result;
    };

    /**
     * Generate an irreducible generator polynomial of specified degree
     * (used by Reed-Solomon encoder)
     *
     * @param  {Number} degree Degree of the generator polynomial
     * @return {Buffer}        Buffer containing polynomial coefficients
     */
    exports.generateECPolynomial = function generateECPolynomial(degree) {
      var poly = new Buffer([1]);
      for (var i = 0; i < degree; i++) {
        poly = exports.mul(poly, [1, GF.exp(i)]);
      }

      return poly;
    };
  }, { "../utils/buffer": 79, "./galois-field": 64 }], 70: [function (require, module, exports) {
    var Buffer = require('../utils/buffer');
    var Utils = require('./utils');
    var ECLevel = require('./error-correction-level');
    var BitBuffer = require('./bit-buffer');
    var BitMatrix = require('./bit-matrix');
    var AlignmentPattern = require('./alignment-pattern');
    var FinderPattern = require('./finder-pattern');
    var MaskPattern = require('./mask-pattern');
    var ECCode = require('./error-correction-code');
    var ReedSolomonEncoder = require('./reed-solomon-encoder');
    var Version = require('./version');
    var FormatInfo = require('./format-info');
    var Mode = require('./mode');
    var Segments = require('./segments');
    var isArray = require('isarray');

    /**
     * QRCode for JavaScript
     *
     * modified by Ryan Day for nodejs support
     * Copyright (c) 2011 Ryan Day
     *
     * Licensed under the MIT license:
     *   http://www.opensource.org/licenses/mit-license.php
     *
    //---------------------------------------------------------------------
    // QRCode for JavaScript
    //
    // Copyright (c) 2009 Kazuhiko Arase
    //
    // URL: http://www.d-project.com/
    //
    // Licensed under the MIT license:
    //   http://www.opensource.org/licenses/mit-license.php
    //
    // The word "QR Code" is registered trademark of
    // DENSO WAVE INCORPORATED
    //   http://www.denso-wave.com/qrcode/faqpatent-e.html
    //
    //---------------------------------------------------------------------
    */

    /**
     * Add finder patterns bits to matrix
     *
     * @param  {BitMatrix} matrix  Modules matrix
     * @param  {Number}    version QR Code version
     */
    function setupFinderPattern(matrix, version) {
      var size = matrix.size;
      var pos = FinderPattern.getPositions(version);

      for (var i = 0; i < pos.length; i++) {
        var row = pos[i][0];
        var col = pos[i][1];

        for (var r = -1; r <= 7; r++) {
          if (row + r <= -1 || size <= row + r) continue;

          for (var c = -1; c <= 7; c++) {
            if (col + c <= -1 || size <= col + c) continue;

            if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }

    /**
     * Add timing pattern bits to matrix
     *
     * Note: this function must be called before {@link setupAlignmentPattern}
     *
     * @param  {BitMatrix} matrix Modules matrix
     */
    function setupTimingPattern(matrix) {
      var size = matrix.size;

      for (var r = 8; r < size - 8; r++) {
        var value = r % 2 === 0;
        matrix.set(r, 6, value, true);
        matrix.set(6, r, value, true);
      }
    }

    /**
     * Add alignment patterns bits to matrix
     *
     * Note: this function must be called after {@link setupTimingPattern}
     *
     * @param  {BitMatrix} matrix  Modules matrix
     * @param  {Number}    version QR Code version
     */
    function setupAlignmentPattern(matrix, version) {
      var pos = AlignmentPattern.getPositions(version);

      for (var i = 0; i < pos.length; i++) {
        var row = pos[i][0];
        var col = pos[i][1];

        for (var r = -2; r <= 2; r++) {
          for (var c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }

    /**
     * Add version info bits to matrix
     *
     * @param  {BitMatrix} matrix  Modules matrix
     * @param  {Number}    version QR Code version
     */
    function setupVersionInfo(matrix, version) {
      var size = matrix.size;
      var bits = Version.getEncodedBits(version);
      var row, col, mod;

      for (var i = 0; i < 18; i++) {
        row = Math.floor(i / 3);
        col = i % 3 + size - 8 - 3;
        mod = (bits >> i & 1) === 1;

        matrix.set(row, col, mod, true);
        matrix.set(col, row, mod, true);
      }
    }

    /**
     * Add format info bits to matrix
     *
     * @param  {BitMatrix} matrix               Modules matrix
     * @param  {ErrorCorrectionLevel}    errorCorrectionLevel Error correction level
     * @param  {Number}    maskPattern          Mask pattern reference value
     */
    function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
      var size = matrix.size;
      var bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
      var i, mod;

      for (i = 0; i < 15; i++) {
        mod = (bits >> i & 1) === 1;

        // vertical
        if (i < 6) {
          matrix.set(i, 8, mod, true);
        } else if (i < 8) {
          matrix.set(i + 1, 8, mod, true);
        } else {
          matrix.set(size - 15 + i, 8, mod, true);
        }

        // horizontal
        if (i < 8) {
          matrix.set(8, size - i - 1, mod, true);
        } else if (i < 9) {
          matrix.set(8, 15 - i - 1 + 1, mod, true);
        } else {
          matrix.set(8, 15 - i - 1, mod, true);
        }
      }

      // fixed module
      matrix.set(size - 8, 8, 1, true);
    }

    /**
     * Add encoded data bits to matrix
     *
     * @param  {BitMatrix} matrix Modules matrix
     * @param  {Buffer}    data   Data codewords
     */
    function setupData(matrix, data) {
      var size = matrix.size;
      var inc = -1;
      var row = size - 1;
      var bitIndex = 7;
      var byteIndex = 0;

      for (var col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;

        while (true) {
          for (var c = 0; c < 2; c++) {
            if (!matrix.isReserved(row, col - c)) {
              var dark = false;

              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) === 1;
              }

              matrix.set(row, col - c, dark);
              bitIndex--;

              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }

          row += inc;

          if (row < 0 || size <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }

    /**
     * Create encoded codewords from data input
     *
     * @param  {Number}   version              QR Code version
     * @param  {ErrorCorrectionLevel}   errorCorrectionLevel Error correction level
     * @param  {ByteData} data                 Data input
     * @return {Buffer}                        Buffer containing encoded codewords
     */
    function createData(version, errorCorrectionLevel, segments) {
      // Prepare data buffer
      var buffer = new BitBuffer();

      segments.forEach(function (data) {
        // prefix data with mode indicator (4 bits)
        buffer.put(data.mode.bit, 4);

        // Prefix data with character count indicator.
        // The character count indicator is a string of bits that represents the
        // number of characters that are being encoded.
        // The character count indicator must be placed after the mode indicator
        // and must be a certain number of bits long, depending on the QR version
        // and data mode
        // @see {@link Mode.getCharCountIndicator}.
        buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version));

        // add binary data sequence to buffer
        data.write(buffer);
      });

      // Calculate required number of bits
      var totalCodewords = Utils.getSymbolTotalCodewords(version);
      var ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      var dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;

      // Add a terminator.
      // If the bit string is shorter than the total number of required bits,
      // a terminator of up to four 0s must be added to the right side of the string.
      // If the bit string is more than four bits shorter than the required number of bits,
      // add four 0s to the end.
      if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
        buffer.put(0, 4);
      }

      // If the bit string is fewer than four bits shorter, add only the number of 0s that
      // are needed to reach the required number of bits.

      // After adding the terminator, if the number of bits in the string is not a multiple of 8,
      // pad the string on the right with 0s to make the string's length a multiple of 8.
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(0);
      }

      // Add pad bytes if the string is still shorter than the total number of required bits.
      // Extend the buffer to fill the data capacity of the symbol corresponding to
      // the Version and Error Correction Level by adding the Pad Codewords 11101100 (0xEC)
      // and 00010001 (0x11) alternately.
      var remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
      for (var i = 0; i < remainingByte; i++) {
        buffer.put(i % 2 ? 0x11 : 0xEC, 8);
      }

      return createCodewords(buffer, version, errorCorrectionLevel);
    }

    /**
     * Encode input data with Reed-Solomon and return codewords with
     * relative error correction bits
     *
     * @param  {BitBuffer} bitBuffer            Data to encode
     * @param  {Number}    version              QR Code version
     * @param  {ErrorCorrectionLevel} errorCorrectionLevel Error correction level
     * @return {Buffer}                         Buffer containing encoded codewords
     */
    function createCodewords(bitBuffer, version, errorCorrectionLevel) {
      // Total codewords for this QR code version (Data + Error correction)
      var totalCodewords = Utils.getSymbolTotalCodewords(version);

      // Total number of error correction codewords
      var ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);

      // Total number of data codewords
      var dataTotalCodewords = totalCodewords - ecTotalCodewords;

      // Total number of blocks
      var ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);

      // Calculate how many blocks each group should contain
      var blocksInGroup2 = totalCodewords % ecTotalBlocks;
      var blocksInGroup1 = ecTotalBlocks - blocksInGroup2;

      var totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);

      var dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
      var dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;

      // Number of EC codewords is the same for both groups
      var ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;

      // Initialize a Reed-Solomon encoder with a generator polynomial of degree ecCount
      var rs = new ReedSolomonEncoder(ecCount);

      var offset = 0;
      var dcData = new Array(ecTotalBlocks);
      var ecData = new Array(ecTotalBlocks);
      var maxDataSize = 0;
      var buffer = new Buffer(bitBuffer.buffer);

      // Divide the buffer into the required number of blocks
      for (var b = 0; b < ecTotalBlocks; b++) {
        var dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;

        // extract a block of data from buffer
        dcData[b] = buffer.slice(offset, offset + dataSize);

        // Calculate EC codewords for this data block
        ecData[b] = rs.encode(dcData[b]);

        offset += dataSize;
        maxDataSize = Math.max(maxDataSize, dataSize);
      }

      // Create final data
      // Interleave the data and error correction codewords from each block
      var data = new Buffer(totalCodewords);
      var index = 0;
      var i, r;

      // Add data codewords
      for (i = 0; i < maxDataSize; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          if (i < dcData[r].length) {
            data[index++] = dcData[r][i];
          }
        }
      }

      // Apped EC codewords
      for (i = 0; i < ecCount; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          data[index++] = ecData[r][i];
        }
      }

      return data;
    }

    /**
     * Build QR Code symbol
     *
     * @param  {String} data                 Input string
     * @param  {Number} version              QR Code version
     * @param  {ErrorCorretionLevel} errorCorrectionLevel Error level
     * @param  {MaskPattern} maskPattern     Mask pattern
     * @return {Object}                      Object containing symbol data
     */
    function createSymbol(data, version, errorCorrectionLevel, maskPattern) {
      var segments;

      if (isArray(data)) {
        segments = Segments.fromArray(data);
      } else if (typeof data === 'string') {
        var estimatedVersion = version;

        if (!estimatedVersion) {
          var rawSegments = Segments.rawSplit(data);

          // Estimate best version that can contain raw splitted segments
          estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
        }

        // Build optimized segments
        // If estimated version is undefined, try with the highest version
        segments = Segments.fromString(data, estimatedVersion || 40);
      } else {
        throw new Error('Invalid data');
      }

      // Get the min version that can contain data
      var bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);

      // If no version is found, data cannot be stored
      if (!bestVersion) {
        throw new Error('The amount of data is too big to be stored in a QR Code');
      }

      // If not specified, use min version as default
      if (!version) {
        version = bestVersion;

        // Check if the specified version can contain the data
      } else if (version < bestVersion) {
        throw new Error('\n' + 'The chosen QR Code version cannot contain this amount of data.\n' + 'Minimum version required to store current data is: ' + bestVersion + '.\n');
      }

      var dataBits = createData(version, errorCorrectionLevel, segments);

      // Allocate matrix buffer
      var moduleCount = Utils.getSymbolSize(version);
      var modules = new BitMatrix(moduleCount);

      // Add function modules
      setupFinderPattern(modules, version);
      setupTimingPattern(modules);
      setupAlignmentPattern(modules, version);

      // Add temporary dummy bits for format info just to set them as reserved.
      // This is needed to prevent these bits from being masked by {@link MaskPattern.applyMask}
      // since the masking operation must be performed only on the encoding region.
      // These blocks will be replaced with correct values later in code.
      setupFormatInfo(modules, errorCorrectionLevel, 0);

      if (version >= 7) {
        setupVersionInfo(modules, version);
      }

      // Add data codewords
      setupData(modules, dataBits);

      if (!maskPattern) {
        // Find best mask pattern
        maskPattern = MaskPattern.getBestMask(modules, setupFormatInfo.bind(null, modules, errorCorrectionLevel));
      }

      // Apply mask pattern
      MaskPattern.applyMask(maskPattern, modules);

      // Replace format info bits with correct values
      setupFormatInfo(modules, errorCorrectionLevel, maskPattern);

      return {
        modules: modules,
        version: version,
        errorCorrectionLevel: errorCorrectionLevel,
        maskPattern: maskPattern,
        segments: segments
      };
    }

    /**
     * QR Code
     *
     * @param {String | Array} data                 Input data
     * @param {Object} options                      Optional configurations
     * @param {Number} options.version              QR Code version
     * @param {String} options.errorCorrectionLevel Error correction level
     * @param {Function} options.toSJISFunc         Helper func to convert utf8 to sjis
     */
    exports.create = function create(data, options) {
      if (typeof data === 'undefined' || data === '') {
        throw new Error('No input text');
      }

      var errorCorrectionLevel = ECLevel.M;
      var version;
      var mask;

      if (typeof options !== 'undefined') {
        // Use higher error correction level as default
        errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
        version = Version.from(options.version);
        mask = MaskPattern.from(options.maskPattern);

        if (options.toSJISFunc) {
          Utils.setToSJISFunction(options.toSJISFunc);
        }
      }

      return createSymbol(data, version, errorCorrectionLevel, mask);
    };
  }, { "../utils/buffer": 79, "./alignment-pattern": 55, "./bit-buffer": 57, "./bit-matrix": 58, "./error-correction-code": 60, "./error-correction-level": 61, "./finder-pattern": 62, "./format-info": 63, "./mask-pattern": 66, "./mode": 67, "./reed-solomon-encoder": 71, "./segments": 73, "./utils": 74, "./version": 75, "isarray": 80 }], 71: [function (require, module, exports) {
    var Buffer = require('../utils/buffer');
    var Polynomial = require('./polynomial');

    function ReedSolomonEncoder(degree) {
      this.genPoly = undefined;
      this.degree = degree;

      if (this.degree) this.initialize(this.degree);
    }

    /**
     * Initialize the encoder.
     * The input param should correspond to the number of error correction codewords.
     *
     * @param  {Number} degree
     */
    ReedSolomonEncoder.prototype.initialize = function initialize(degree) {
      // create an irreducible generator polynomial
      this.degree = degree;
      this.genPoly = Polynomial.generateECPolynomial(this.degree);
    };

    /**
     * Encodes a chunk of data
     *
     * @param  {Buffer} data Buffer containing input data
     * @return {Buffer}      Buffer containing encoded data
     */
    ReedSolomonEncoder.prototype.encode = function encode(data) {
      if (!this.genPoly) {
        throw new Error('Encoder not initialized');
      }

      // Calculate EC for this data block
      // extends data size to data+genPoly size
      var pad = new Buffer(this.degree);
      pad.fill(0);
      var paddedData = Buffer.concat([data, pad], data.length + this.degree);

      // The error correction codewords are the remainder after dividing the data codewords
      // by a generator polynomial
      var remainder = Polynomial.mod(paddedData, this.genPoly);

      // return EC data blocks (last n byte, where n is the degree of genPoly)
      // If coefficients number in remainder are less than genPoly degree,
      // pad with 0s to the left to reach the needed number of coefficients
      var start = this.degree - remainder.length;
      if (start > 0) {
        var buff = new Buffer(this.degree);
        buff.fill(0);
        remainder.copy(buff, start);

        return buff;
      }

      return remainder;
    };

    module.exports = ReedSolomonEncoder;
  }, { "../utils/buffer": 79, "./polynomial": 69 }], 72: [function (require, module, exports) {
    var numeric = '[0-9]+';
    var alphanumeric = '[A-Z $%*+\\-./:]+';
    var kanji = '(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|' + '[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|' + '[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|' + '[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+';
    kanji = kanji.replace(/u/g, "\\u");

    var byte = '(?:(?![A-Z0-9 $%*+\\-./:]|' + kanji + ').)+';

    exports.KANJI = new RegExp(kanji, 'g');
    exports.BYTE_KANJI = new RegExp('[^A-Z0-9 $%*+\\-./:]+', 'g');
    exports.BYTE = new RegExp(byte, 'g');
    exports.NUMERIC = new RegExp(numeric, 'g');
    exports.ALPHANUMERIC = new RegExp(alphanumeric, 'g');

    var TEST_KANJI = new RegExp('^' + kanji + '$');
    var TEST_NUMERIC = new RegExp('^' + numeric + '$');
    var TEST_ALPHANUMERIC = new RegExp('^[A-Z0-9 $%*+\\-./:]+$');

    exports.testKanji = function testKanji(str) {
      return TEST_KANJI.test(str);
    };

    exports.testNumeric = function testNumeric(str) {
      return TEST_NUMERIC.test(str);
    };

    exports.testAlphanumeric = function testAlphanumeric(str) {
      return TEST_ALPHANUMERIC.test(str);
    };
  }, {}], 73: [function (require, module, exports) {
    var Mode = require('./mode');
    var NumericData = require('./numeric-data');
    var AlphanumericData = require('./alphanumeric-data');
    var ByteData = require('./byte-data');
    var KanjiData = require('./kanji-data');
    var Regex = require('./regex');
    var Utils = require('./utils');
    var dijkstra = require('dijkstrajs');

    /**
     * Returns UTF8 byte length
     *
     * @param  {String} str Input string
     * @return {Number}     Number of byte
     */
    function getStringByteLength(str) {
      return unescape(encodeURIComponent(str)).length;
    }

    /**
     * Get a list of segments of the specified mode
     * from a string
     *
     * @param  {Mode}   mode Segment mode
     * @param  {String} str  String to process
     * @return {Array}       Array of object with segments data
     */
    function getSegments(regex, mode, str) {
      var segments = [];
      var result;

      while ((result = regex.exec(str)) !== null) {
        segments.push({
          data: result[0],
          index: result.index,
          mode: mode,
          length: result[0].length
        });
      }

      return segments;
    }

    /**
     * Extracts a series of segments with the appropriate
     * modes from a string
     *
     * @param  {String} dataStr Input string
     * @return {Array}          Array of object with segments data
     */
    function getSegmentsFromString(dataStr) {
      var numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
      var alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
      var byteSegs;
      var kanjiSegs;

      if (Utils.isKanjiModeEnabled()) {
        byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
        kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
      } else {
        byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
        kanjiSegs = [];
      }

      var segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);

      return segs.sort(function (s1, s2) {
        return s1.index - s2.index;
      }).map(function (obj) {
        return {
          data: obj.data,
          mode: obj.mode,
          length: obj.length
        };
      });
    }

    /**
     * Returns how many bits are needed to encode a string of
     * specified length with the specified mode
     *
     * @param  {Number} length String length
     * @param  {Mode} mode     Segment mode
     * @return {Number}        Bit length
     */
    function getSegmentBitsLength(length, mode) {
      switch (mode) {
        case Mode.NUMERIC:
          return NumericData.getBitsLength(length);
        case Mode.ALPHANUMERIC:
          return AlphanumericData.getBitsLength(length);
        case Mode.KANJI:
          return KanjiData.getBitsLength(length);
        case Mode.BYTE:
          return ByteData.getBitsLength(length);
      }
    }

    /**
     * Merges adjacent segments which have the same mode
     *
     * @param  {Array} segs Array of object with segments data
     * @return {Array}      Array of object with segments data
     */
    function mergeSegments(segs) {
      return segs.reduce(function (acc, curr) {
        var prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
        if (prevSeg && prevSeg.mode === curr.mode) {
          acc[acc.length - 1].data += curr.data;
          return acc;
        }

        acc.push(curr);
        return acc;
      }, []);
    }

    /**
     * Generates a list of all possible nodes combination which
     * will be used to build a segments graph.
     *
     * Nodes are divided by groups. Each group will contain a list of all the modes
     * in which is possible to encode the given text.
     *
     * For example the text '12345' can be encoded as Numeric, Alphanumeric or Byte.
     * The group for '12345' will contain then 3 objects, one for each
     * possible encoding mode.
     *
     * Each node represents a possible segment.
     *
     * @param  {Array} segs Array of object with segments data
     * @return {Array}      Array of object with segments data
     */
    function buildNodes(segs) {
      var nodes = [];
      for (var i = 0; i < segs.length; i++) {
        var seg = segs[i];

        switch (seg.mode) {
          case Mode.NUMERIC:
            nodes.push([seg, { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length }, { data: seg.data, mode: Mode.BYTE, length: seg.length }]);
            break;
          case Mode.ALPHANUMERIC:
            nodes.push([seg, { data: seg.data, mode: Mode.BYTE, length: seg.length }]);
            break;
          case Mode.KANJI:
            nodes.push([seg, { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }]);
            break;
          case Mode.BYTE:
            nodes.push([{ data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }]);
        }
      }

      return nodes;
    }

    /**
     * Builds a graph from a list of nodes.
     * All segments in each node group will be connected with all the segments of
     * the next group and so on.
     *
     * At each connection will be assigned a weight depending on the
     * segment's byte length.
     *
     * @param  {Array} nodes    Array of object with segments data
     * @param  {Number} version QR Code version
     * @return {Object}         Graph of all possible segments
     */
    function buildGraph(nodes, version) {
      var table = {};
      var graph = { 'start': {} };
      var prevNodeIds = ['start'];

      for (var i = 0; i < nodes.length; i++) {
        var nodeGroup = nodes[i];
        var currentNodeIds = [];

        for (var j = 0; j < nodeGroup.length; j++) {
          var node = nodeGroup[j];
          var key = '' + i + j;

          currentNodeIds.push(key);
          table[key] = { node: node, lastCount: 0 };
          graph[key] = {};

          for (var n = 0; n < prevNodeIds.length; n++) {
            var prevNodeId = prevNodeIds[n];

            if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
              graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);

              table[prevNodeId].lastCount += node.length;
            } else {
              if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;

              graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version); // switch cost
            }
          }
        }

        prevNodeIds = currentNodeIds;
      }

      for (n = 0; n < prevNodeIds.length; n++) {
        graph[prevNodeIds[n]]['end'] = 0;
      }

      return { map: graph, table: table };
    }

    /**
     * Builds a segment from a specified data and mode.
     * If a mode is not specified, the more suitable will be used.
     *
     * @param  {String} data             Input data
     * @param  {Mode | String} modesHint Data mode
     * @return {Segment}                 Segment
     */
    function buildSingleSegment(data, modesHint) {
      var mode;
      var bestMode = Mode.getBestModeForData(data);

      mode = Mode.from(modesHint, bestMode);

      // Make sure data can be encoded
      if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
        throw new Error('"' + data + '"' + ' cannot be encoded with mode ' + Mode.toString(mode) + '.\n Suggested mode is: ' + Mode.toString(bestMode));
      }

      // Use Mode.BYTE if Kanji support is disabled
      if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
        mode = Mode.BYTE;
      }

      switch (mode) {
        case Mode.NUMERIC:
          return new NumericData(data);

        case Mode.ALPHANUMERIC:
          return new AlphanumericData(data);

        case Mode.KANJI:
          return new KanjiData(data);

        case Mode.BYTE:
          return new ByteData(data);
      }
    }

    /**
     * Builds a list of segments from an array.
     * Array can contain Strings or Objects with segment's info.
     *
     * For each item which is a string, will be generated a segment with the given
     * string and the more appropriate encoding mode.
     *
     * For each item which is an object, will be generated a segment with the given
     * data and mode.
     * Objects must contain at least the property "data".
     * If property "mode" is not present, the more suitable mode will be used.
     *
     * @param  {Array} array Array of objects with segments data
     * @return {Array}       Array of Segments
     */
    exports.fromArray = function fromArray(array) {
      return array.reduce(function (acc, seg) {
        if (typeof seg === 'string') {
          acc.push(buildSingleSegment(seg, null));
        } else if (seg.data) {
          acc.push(buildSingleSegment(seg.data, seg.mode));
        }

        return acc;
      }, []);
    };

    /**
     * Builds an optimized sequence of segments from a string,
     * which will produce the shortest possible bitstream.
     *
     * @param  {String} data    Input string
     * @param  {Number} version QR Code version
     * @return {Array}          Array of segments
     */
    exports.fromString = function fromString(data, version) {
      var segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());

      var nodes = buildNodes(segs);
      var graph = buildGraph(nodes, version);
      var path = dijkstra.find_path(graph.map, 'start', 'end');

      var optimizedSegs = [];
      for (var i = 1; i < path.length - 1; i++) {
        optimizedSegs.push(graph.table[path[i]].node);
      }

      return exports.fromArray(mergeSegments(optimizedSegs));
    };

    /**
     * Splits a string in various segments with the modes which
     * best represent their content.
     * The produced segments are far from being optimized.
     * The output of this function is only used to estimate a QR Code version
     * which may contain the data.
     *
     * @param  {string} data Input string
     * @return {Array}       Array of segments
     */
    exports.rawSplit = function rawSplit(data) {
      return exports.fromArray(getSegmentsFromString(data, Utils.isKanjiModeEnabled()));
    };
  }, { "./alphanumeric-data": 56, "./byte-data": 59, "./kanji-data": 65, "./mode": 67, "./numeric-data": 68, "./regex": 72, "./utils": 74, "dijkstrajs": 52 }], 74: [function (require, module, exports) {
    var toSJISFunction;
    var CODEWORDS_COUNT = [0, // Not used
    26, 44, 70, 100, 134, 172, 196, 242, 292, 346, 404, 466, 532, 581, 655, 733, 815, 901, 991, 1085, 1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185, 2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706];

    /**
     * Returns the QR Code size for the specified version
     *
     * @param  {Number} version QR Code version
     * @return {Number}         size of QR code
     */
    exports.getSymbolSize = function getSymbolSize(version) {
      if (!version) throw new Error('"version" cannot be null or undefined');
      if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40');
      return version * 4 + 17;
    };

    /**
     * Returns the total number of codewords used to store data and EC information.
     *
     * @param  {Number} version QR Code version
     * @return {Number}         Data length in bits
     */
    exports.getSymbolTotalCodewords = function getSymbolTotalCodewords(version) {
      return CODEWORDS_COUNT[version];
    };

    /**
     * Encode data with Bose-Chaudhuri-Hocquenghem
     *
     * @param  {Number} data Value to encode
     * @return {Number}      Encoded value
     */
    exports.getBCHDigit = function (data) {
      var digit = 0;

      while (data !== 0) {
        digit++;
        data >>>= 1;
      }

      return digit;
    };

    exports.setToSJISFunction = function setToSJISFunction(f) {
      if (typeof f !== 'function') {
        throw new Error('"toSJISFunc" is not a valid function.');
      }

      toSJISFunction = f;
    };

    exports.isKanjiModeEnabled = function () {
      return typeof toSJISFunction !== 'undefined';
    };

    exports.toSJIS = function toSJIS(kanji) {
      return toSJISFunction(kanji);
    };
  }, {}], 75: [function (require, module, exports) {
    var Utils = require('./utils');
    var ECCode = require('./error-correction-code');
    var ECLevel = require('./error-correction-level');
    var Mode = require('./mode');
    var isArray = require('isarray');

    // Generator polynomial used to encode version information
    var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
    var G18_BCH = Utils.getBCHDigit(G18);

    function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
      for (var currentVersion = 1; currentVersion <= 40; currentVersion++) {
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
          return currentVersion;
        }
      }

      return undefined;
    }

    function getReservedBitsCount(mode, version) {
      // Character count indicator + mode indicator bits
      return Mode.getCharCountIndicator(mode, version) + 4;
    }

    function getTotalBitsFromDataArray(segments, version) {
      var totalBits = 0;

      segments.forEach(function (data) {
        var reservedBits = getReservedBitsCount(data.mode, version);
        totalBits += reservedBits + data.getBitsLength();
      });

      return totalBits;
    }

    function getBestVersionForMixedData(segments, errorCorrectionLevel) {
      for (var currentVersion = 1; currentVersion <= 40; currentVersion++) {
        var length = getTotalBitsFromDataArray(segments, currentVersion);
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
          return currentVersion;
        }
      }

      return undefined;
    }

    /**
     * Check if QR Code version is valid
     *
     * @param  {Number}  version QR Code version
     * @return {Boolean}         true if valid version, false otherwise
     */
    exports.isValid = function isValid(version) {
      return !isNaN(version) && version >= 1 && version <= 40;
    };

    /**
     * Returns version number from a value.
     * If value is not a valid version, returns defaultValue
     *
     * @param  {Number|String} value        QR Code version
     * @param  {Number}        defaultValue Fallback value
     * @return {Number}                     QR Code version number
     */
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return parseInt(value, 10);
      }

      return defaultValue;
    };

    /**
     * Returns how much data can be stored with the specified QR code version
     * and error correction level
     *
     * @param  {Number} version              QR Code version (1-40)
     * @param  {Number} errorCorrectionLevel Error correction level
     * @param  {Mode}   mode                 Data mode
     * @return {Number}                      Quantity of storable data
     */
    exports.getCapacity = function getCapacity(version, errorCorrectionLevel, mode) {
      if (!exports.isValid(version)) {
        throw new Error('Invalid QR Code version');
      }

      // Use Byte mode as default
      if (typeof mode === 'undefined') mode = Mode.BYTE;

      // Total codewords for this QR code version (Data + Error correction)
      var totalCodewords = Utils.getSymbolTotalCodewords(version);

      // Total number of error correction codewords
      var ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);

      // Total number of data codewords
      var dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;

      if (mode === Mode.MIXED) return dataTotalCodewordsBits;

      var usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);

      // Return max number of storable codewords
      switch (mode) {
        case Mode.NUMERIC:
          return Math.floor(usableBits / 10 * 3);

        case Mode.ALPHANUMERIC:
          return Math.floor(usableBits / 11 * 2);

        case Mode.KANJI:
          return Math.floor(usableBits / 13);

        case Mode.BYTE:
        default:
          return Math.floor(usableBits / 8);
      }
    };

    /**
     * Returns the minimum version needed to contain the amount of data
     *
     * @param  {Segment} data                    Segment of data
     * @param  {Number} [errorCorrectionLevel=H] Error correction level
     * @param  {Mode} mode                       Data mode
     * @return {Number}                          QR Code version
     */
    exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel) {
      var seg;

      var ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);

      if (isArray(data)) {
        if (data.length > 1) {
          return getBestVersionForMixedData(data, ecl);
        }

        if (data.length === 0) {
          return 1;
        }

        seg = data[0];
      } else {
        seg = data;
      }

      return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
    };

    /**
     * Returns version information with relative error correction bits
     *
     * The version information is included in QR Code symbols of version 7 or larger.
     * It consists of an 18-bit sequence containing 6 data bits,
     * with 12 error correction bits calculated using the (18, 6) Golay code.
     *
     * @param  {Number} version QR Code version
     * @return {Number}         Encoded version info bits
     */
    exports.getEncodedBits = function getEncodedBits(version) {
      if (!exports.isValid(version) || version < 7) {
        throw new Error('Invalid QR Code version');
      }

      var d = version << 12;

      while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
        d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
      }

      return version << 12 | d;
    };
  }, { "./error-correction-code": 60, "./error-correction-level": 61, "./mode": 67, "./utils": 74, "isarray": 80 }], 76: [function (require, module, exports) {
    var Utils = require('./utils');

    function clearCanvas(ctx, canvas, size) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!canvas.style) canvas.style = {};
      canvas.height = size;
      canvas.width = size;
      canvas.style.height = size + 'px';
      canvas.style.width = size + 'px';
    }

    function getCanvasElement() {
      try {
        return document.createElement('canvas');
      } catch (e) {
        throw new Error('You need to specify a canvas element');
      }
    }

    exports.render = function render(qrData, canvas, options) {
      var opts = options;
      var canvasEl = canvas;

      if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = undefined;
      }

      if (!canvas) {
        canvasEl = getCanvasElement();
      }

      opts = Utils.getOptions(opts);
      var size = Utils.getImageWidth(qrData.modules.size, opts);

      var ctx = canvasEl.getContext('2d');
      var image = ctx.createImageData(size, size);
      Utils.qrToImageData(image.data, qrData, opts);

      clearCanvas(ctx, canvasEl, size);
      ctx.putImageData(image, 0, 0);

      return canvasEl;
    };

    exports.renderToDataURL = function renderToDataURL(qrData, canvas, options) {
      var opts = options;

      if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = undefined;
      }

      if (!opts) opts = {};

      var canvasEl = exports.render(qrData, canvas, opts);

      var type = opts.type || 'image/png';
      var rendererOpts = opts.rendererOpts || {};

      return canvasEl.toDataURL(type, rendererOpts.quality);
    };
  }, { "./utils": 78 }], 77: [function (require, module, exports) {
    var Utils = require('./utils');

    function getColorAttrib(color, attrib) {
      var alpha = color.a / 255;
      var str = attrib + '="' + color.hex + '"';

      return alpha < 1 ? str + ' ' + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
    }

    function svgCmd(cmd, x, y) {
      var str = cmd + x;
      if (typeof y !== 'undefined') str += ' ' + y;

      return str;
    }

    function qrToPath(data, size, margin) {
      var path = '';
      var moveBy = 0;
      var newRow = false;
      var lineLength = 0;

      for (var i = 0; i < data.length; i++) {
        var col = Math.floor(i % size);
        var row = Math.floor(i / size);

        if (!col && !newRow) newRow = true;

        if (data[i]) {
          lineLength++;

          if (!(i > 0 && col > 0 && data[i - 1])) {
            path += newRow ? svgCmd('M', col + margin, 0.5 + row + margin) : svgCmd('m', moveBy, 0);

            moveBy = 0;
            newRow = false;
          }

          if (!(col + 1 < size && data[i + 1])) {
            path += svgCmd('h', lineLength);
            lineLength = 0;
          }
        } else {
          moveBy++;
        }
      }

      return path;
    }

    exports.render = function render(qrData, options, cb) {
      var opts = Utils.getOptions(options);
      var size = qrData.modules.size;
      var data = qrData.modules.data;
      var qrcodesize = size + opts.margin * 2;

      var bg = !opts.color.light.a ? '' : '<path ' + getColorAttrib(opts.color.light, 'fill') + ' d="M0 0h' + qrcodesize + 'v' + qrcodesize + 'H0z"/>';

      var path = '<path ' + getColorAttrib(opts.color.dark, 'stroke') + ' d="' + qrToPath(data, size, opts.margin) + '"/>';

      var viewBox = 'viewBox="' + '0 0 ' + qrcodesize + ' ' + qrcodesize + '"';

      var width = !opts.width ? '' : 'width="' + opts.width + '" height="' + opts.width + '" ';

      var svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + '>' + bg + path + '</svg>';

      if (typeof cb === 'function') {
        cb(null, svgTag);
      }

      return svgTag;
    };
  }, { "./utils": 78 }], 78: [function (require, module, exports) {
    function hex2rgba(hex) {
      if (typeof hex !== 'string') {
        throw new Error('Color should be defined as hex string');
      }

      var hexCode = hex.slice().replace('#', '').split('');
      if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
        throw new Error('Invalid hex color: ' + hex);
      }

      // Convert from short to long form (fff -> ffffff)
      if (hexCode.length === 3 || hexCode.length === 4) {
        hexCode = Array.prototype.concat.apply([], hexCode.map(function (c) {
          return [c, c];
        }));
      }

      // Add default alpha value
      if (hexCode.length === 6) hexCode.push('F', 'F');

      var hexValue = parseInt(hexCode.join(''), 16);

      return {
        r: hexValue >> 24 & 255,
        g: hexValue >> 16 & 255,
        b: hexValue >> 8 & 255,
        a: hexValue & 255,
        hex: '#' + hexCode.slice(0, 6).join('')
      };
    }

    exports.getOptions = function getOptions(options) {
      if (!options) options = {};
      if (!options.color) options.color = {};

      var margin = typeof options.margin === 'undefined' || options.margin === null || options.margin < 0 ? 4 : options.margin;

      var width = options.width && options.width >= 21 ? options.width : undefined;
      var scale = options.scale || 4;

      return {
        width: width,
        scale: width ? 4 : scale,
        margin: margin,
        color: {
          dark: hex2rgba(options.color.dark || '#000000ff'),
          light: hex2rgba(options.color.light || '#ffffffff')
        },
        type: options.type,
        rendererOpts: options.rendererOpts || {}
      };
    };

    exports.getScale = function getScale(qrSize, opts) {
      return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
    };

    exports.getImageWidth = function getImageWidth(qrSize, opts) {
      var scale = exports.getScale(qrSize, opts);
      return Math.floor((qrSize + opts.margin * 2) * scale);
    };

    exports.qrToImageData = function qrToImageData(imgData, qr, opts) {
      var size = qr.modules.size;
      var data = qr.modules.data;
      var scale = exports.getScale(size, opts);
      var symbolSize = Math.floor((size + opts.margin * 2) * scale);
      var scaledMargin = opts.margin * scale;
      var palette = [opts.color.light, opts.color.dark];

      for (var i = 0; i < symbolSize; i++) {
        for (var j = 0; j < symbolSize; j++) {
          var posDst = (i * symbolSize + j) * 4;
          var pxColor = opts.color.light;

          if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
            var iSrc = Math.floor((i - scaledMargin) / scale);
            var jSrc = Math.floor((j - scaledMargin) / scale);
            pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
          }

          imgData[posDst++] = pxColor.r;
          imgData[posDst++] = pxColor.g;
          imgData[posDst++] = pxColor.b;
          imgData[posDst] = pxColor.a;
        }
      }
    };
  }, {}], 79: [function (require, module, exports) {
    /**
     * Implementation of a subset of node.js Buffer methods for the browser.
     * Based on https://github.com/feross/buffer
     */

    /* eslint-disable no-proto */

    'use strict';

    var isArray = require('isarray');

    function typedArraySupport() {
      // Can typed array instances be augmented?
      try {
        var arr = new Uint8Array(1);
        arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function foo() {
            return 42;
          } };
        return arr.foo() === 42;
      } catch (e) {
        return false;
      }
    }

    Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();

    var K_MAX_LENGTH = Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;

    function Buffer(arg, offset, length) {
      if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
        return new Buffer(arg, offset, length);
      }

      if (typeof arg === 'number') {
        return allocUnsafe(this, arg);
      }

      return from(this, arg, offset, length);
    }

    if (Buffer.TYPED_ARRAY_SUPPORT) {
      Buffer.prototype.__proto__ = Uint8Array.prototype;
      Buffer.__proto__ = Uint8Array;

      // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
      if (typeof Symbol !== 'undefined' && Symbol.species && Buffer[Symbol.species] === Buffer) {
        Object.defineProperty(Buffer, Symbol.species, {
          value: null,
          configurable: true,
          enumerable: false,
          writable: false
        });
      }
    }

    function checked(length) {
      // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
      // length is NaN (which is otherwise coerced to zero.)
      if (length >= K_MAX_LENGTH) {
        throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes');
      }
      return length | 0;
    }

    function isnan(val) {
      return val !== val; // eslint-disable-line no-self-compare
    }

    function createBuffer(that, length) {
      var buf;
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        buf = new Uint8Array(length);
        buf.__proto__ = Buffer.prototype;
      } else {
        // Fallback: Return an object instance of the Buffer class
        buf = that;
        if (buf === null) {
          buf = new Buffer(length);
        }
        buf.length = length;
      }

      return buf;
    }

    function allocUnsafe(that, size) {
      var buf = createBuffer(that, size < 0 ? 0 : checked(size) | 0);

      if (!Buffer.TYPED_ARRAY_SUPPORT) {
        for (var i = 0; i < size; ++i) {
          buf[i] = 0;
        }
      }

      return buf;
    }

    function fromString(that, string) {
      var length = byteLength(string) | 0;
      var buf = createBuffer(that, length);

      var actual = buf.write(string);

      if (actual !== length) {
        // Writing a hex string, for example, that contains invalid characters will
        // cause everything after the first invalid character to be ignored. (e.g.
        // 'abxxcd' will be treated as 'ab')
        buf = buf.slice(0, actual);
      }

      return buf;
    }

    function fromArrayLike(that, array) {
      var length = array.length < 0 ? 0 : checked(array.length) | 0;
      var buf = createBuffer(that, length);
      for (var i = 0; i < length; i += 1) {
        buf[i] = array[i] & 255;
      }
      return buf;
    }

    function fromArrayBuffer(that, array, byteOffset, length) {
      if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('\'offset\' is out of bounds');
      }

      if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('\'length\' is out of bounds');
      }

      var buf;
      if (byteOffset === undefined && length === undefined) {
        buf = new Uint8Array(array);
      } else if (length === undefined) {
        buf = new Uint8Array(array, byteOffset);
      } else {
        buf = new Uint8Array(array, byteOffset, length);
      }

      if (Buffer.TYPED_ARRAY_SUPPORT) {
        // Return an augmented `Uint8Array` instance, for best performance
        buf.__proto__ = Buffer.prototype;
      } else {
        // Fallback: Return an object instance of the Buffer class
        buf = fromArrayLike(that, buf);
      }

      return buf;
    }

    function fromObject(that, obj) {
      if (Buffer.isBuffer(obj)) {
        var len = checked(obj.length) | 0;
        var buf = createBuffer(that, len);

        if (buf.length === 0) {
          return buf;
        }

        obj.copy(buf, 0, 0, len);
        return buf;
      }

      if (obj) {
        if (typeof ArrayBuffer !== 'undefined' && obj.buffer instanceof ArrayBuffer || 'length' in obj) {
          if (typeof obj.length !== 'number' || isnan(obj.length)) {
            return createBuffer(that, 0);
          }
          return fromArrayLike(that, obj);
        }

        if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
          return fromArrayLike(that, obj.data);
        }
      }

      throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
    }

    function utf8ToBytes(string, units) {
      units = units || Infinity;
      var codePoint;
      var length = string.length;
      var leadSurrogate = null;
      var bytes = [];

      for (var i = 0; i < length; ++i) {
        codePoint = string.charCodeAt(i);

        // is surrogate component
        if (codePoint > 0xD7FF && codePoint < 0xE000) {
          // last char was a lead
          if (!leadSurrogate) {
            // no lead yet
            if (codePoint > 0xDBFF) {
              // unexpected trail
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
              continue;
            } else if (i + 1 === length) {
              // unpaired lead
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
              continue;
            }

            // valid lead
            leadSurrogate = codePoint;

            continue;
          }

          // 2 leads in a row
          if (codePoint < 0xDC00) {
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
            leadSurrogate = codePoint;
            continue;
          }

          // valid surrogate pair
          codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
        } else if (leadSurrogate) {
          // valid bmp char, but last char was a lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        }

        leadSurrogate = null;

        // encode utf8
        if (codePoint < 0x80) {
          if ((units -= 1) < 0) break;
          bytes.push(codePoint);
        } else if (codePoint < 0x800) {
          if ((units -= 2) < 0) break;
          bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
        } else if (codePoint < 0x10000) {
          if ((units -= 3) < 0) break;
          bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
        } else if (codePoint < 0x110000) {
          if ((units -= 4) < 0) break;
          bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
        } else {
          throw new Error('Invalid code point');
        }
      }

      return bytes;
    }

    function byteLength(string) {
      if (Buffer.isBuffer(string)) {
        return string.length;
      }
      if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
        return string.byteLength;
      }
      if (typeof string !== 'string') {
        string = '' + string;
      }

      var len = string.length;
      if (len === 0) return 0;

      return utf8ToBytes(string).length;
    }

    function blitBuffer(src, dst, offset, length) {
      for (var i = 0; i < length; ++i) {
        if (i + offset >= dst.length || i >= src.length) break;
        dst[i + offset] = src[i];
      }
      return i;
    }

    function utf8Write(buf, string, offset, length) {
      return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
    }

    function from(that, value, offset, length) {
      if (typeof value === 'number') {
        throw new TypeError('"value" argument must not be a number');
      }

      if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
        return fromArrayBuffer(that, value, offset, length);
      }

      if (typeof value === 'string') {
        return fromString(that, value, offset);
      }

      return fromObject(that, value);
    }

    Buffer.prototype.write = function write(string, offset, length) {
      // Buffer#write(string)
      if (offset === undefined) {
        length = this.length;
        offset = 0;
        // Buffer#write(string, encoding)
      } else if (length === undefined && typeof offset === 'string') {
        length = this.length;
        offset = 0;
        // Buffer#write(string, offset[, length])
      } else if (isFinite(offset)) {
        offset = offset | 0;
        if (isFinite(length)) {
          length = length | 0;
        } else {
          length = undefined;
        }
      }

      var remaining = this.length - offset;
      if (length === undefined || length > remaining) length = remaining;

      if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError('Attempt to write outside buffer bounds');
      }

      return utf8Write(this, string, offset, length);
    };

    Buffer.prototype.slice = function slice(start, end) {
      var len = this.length;
      start = ~~start;
      end = end === undefined ? len : ~~end;

      if (start < 0) {
        start += len;
        if (start < 0) start = 0;
      } else if (start > len) {
        start = len;
      }

      if (end < 0) {
        end += len;
        if (end < 0) end = 0;
      } else if (end > len) {
        end = len;
      }

      if (end < start) end = start;

      var newBuf;
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        newBuf = this.subarray(start, end);
        // Return an augmented `Uint8Array` instance
        newBuf.__proto__ = Buffer.prototype;
      } else {
        var sliceLen = end - start;
        newBuf = new Buffer(sliceLen, undefined);
        for (var i = 0; i < sliceLen; ++i) {
          newBuf[i] = this[i + start];
        }
      }

      return newBuf;
    };

    Buffer.prototype.copy = function copy(target, targetStart, start, end) {
      if (!start) start = 0;
      if (!end && end !== 0) end = this.length;
      if (targetStart >= target.length) targetStart = target.length;
      if (!targetStart) targetStart = 0;
      if (end > 0 && end < start) end = start;

      // Copy 0 bytes; we're done
      if (end === start) return 0;
      if (target.length === 0 || this.length === 0) return 0;

      // Fatal error conditions
      if (targetStart < 0) {
        throw new RangeError('targetStart out of bounds');
      }
      if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
      if (end < 0) throw new RangeError('sourceEnd out of bounds');

      // Are we oob?
      if (end > this.length) end = this.length;
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
      }

      var len = end - start;
      var i;

      if (this === target && start < targetStart && targetStart < end) {
        // descending copy from end
        for (i = len - 1; i >= 0; --i) {
          target[i + targetStart] = this[i + start];
        }
      } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
        // ascending copy from start
        for (i = 0; i < len; ++i) {
          target[i + targetStart] = this[i + start];
        }
      } else {
        Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
      }

      return len;
    };

    Buffer.prototype.fill = function fill(val, start, end) {
      // Handle string cases:
      if (typeof val === 'string') {
        if (typeof start === 'string') {
          start = 0;
          end = this.length;
        } else if (typeof end === 'string') {
          end = this.length;
        }
        if (val.length === 1) {
          var code = val.charCodeAt(0);
          if (code < 256) {
            val = code;
          }
        }
      } else if (typeof val === 'number') {
        val = val & 255;
      }

      // Invalid ranges are not set to a default, so can range check early.
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError('Out of range index');
      }

      if (end <= start) {
        return this;
      }

      start = start >>> 0;
      end = end === undefined ? this.length : end >>> 0;

      if (!val) val = 0;

      var i;
      if (typeof val === 'number') {
        for (i = start; i < end; ++i) {
          this[i] = val;
        }
      } else {
        var bytes = Buffer.isBuffer(val) ? val : new Buffer(val);
        var len = bytes.length;
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes[i % len];
        }
      }

      return this;
    };

    Buffer.concat = function concat(list, length) {
      if (!isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }

      if (list.length === 0) {
        return createBuffer(null, 0);
      }

      var i;
      if (length === undefined) {
        length = 0;
        for (i = 0; i < list.length; ++i) {
          length += list[i].length;
        }
      }

      var buffer = allocUnsafe(null, length);
      var pos = 0;
      for (i = 0; i < list.length; ++i) {
        var buf = list[i];
        if (!Buffer.isBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }
        buf.copy(buffer, pos);
        pos += buf.length;
      }
      return buffer;
    };

    Buffer.byteLength = byteLength;

    Buffer.prototype._isBuffer = true;
    Buffer.isBuffer = function isBuffer(b) {
      return !!(b != null && b._isBuffer);
    };

    module.exports = Buffer;
  }, { "isarray": 80 }], 80: [function (require, module, exports) {
    var toString = {}.toString;

    module.exports = Array.isArray || function (arr) {
      return toString.call(arr) == '[object Array]';
    };
  }, {}], 81: [function (require, module, exports) {
    (function (global) {
      'use strict';

      module.exports = (typeof self === "undefined" ? "undefined" : _typeof(self)) === 'object' && self.self === self && self || (typeof global === "undefined" ? "undefined" : _typeof(global)) === 'object' && global.global === global && global || this;
    }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  }, {}] }, {}, [48]);