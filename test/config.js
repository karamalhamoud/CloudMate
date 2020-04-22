"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var glob = require("glob");
var cosmiconfig_1 = require("cosmiconfig");
var MateConfig = (function () {
    function MateConfig(_name, _version, _files, _builds) {
        this.name = _name;
        this.version = _version;
        this.files = _files;
        this.builds = _builds;
        if (this.builds === undefined)
            this.builds = [];
    }
    Object.defineProperty(MateConfig, "configurationExplorer", {
        get: function () {
            if (this._configurationExplorer !== undefined)
                return this._configurationExplorer;
            this._configurationExplorer = cosmiconfig_1.cosmiconfigSync('mateconfig', {
                searchPlaces: [
                    '.mateconfig',
                    '.mateconfig.json',
                    '.mateconfig.yaml',
                    '.mateconfig.yml',
                    '.mateconfig.js',
                    'mateconfig.json',
                    'package.json',
                ],
                transform: function (result) {
                    if (!result || !result.config)
                        return result;
                    if (typeof result.config !== 'object')
                        throw new Error("Config is only allowed to be an object, but received " + typeof result.config + " in \"" + result.filepath + "\"");
                    delete result.config.$schema;
                    return result;
                },
            });
            return this._configurationExplorer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MateConfig, "availableConfigurationFile", {
        get: function () {
            var explorer = this.configurationExplorer;
            try {
                var result = explorer.search();
                return result.filepath;
            }
            catch (_a) {
                throw new Error('Configuration file was not found.');
            }
        },
        enumerable: true,
        configurable: true
    });
    MateConfig.get = function () {
        var configurationFile = MateConfig.availableConfigurationFile;
        if (!configurationFile)
            return null;
        var configJson;
        var result = this.configurationExplorer.load(configurationFile);
        configJson = result.config;
        if (!configJson)
            throw new Error('Error parsing configuration file.');
        var config = new MateConfig(configJson.name, configJson.version, configJson.files, configJson.builds);
        config.format = configJson.format;
        config.setUndefined();
        return config;
    };
    MateConfig.prototype.setPackage = function () {
        this.package = JSON.parse(fs.readFileSync('package.json').toString());
    };
    MateConfig.prototype.getPackageInfo = function (info) {
        if (!this.package)
            this.setPackage();
        return this.package[info];
    };
    MateConfig.prototype.getOutDirName = function () {
        if (this.name)
            return this.name;
        if (this.getPackageInfo('name'))
            return this.getPackageInfo('name');
        return undefined;
    };
    MateConfig.prototype.getOutDirVersion = function () {
        if (this.version)
            return this.version;
        if (this.getPackageInfo('version'))
            return this.getPackageInfo('version');
        return undefined;
    };
    MateConfig.prototype.getBuild = function (name) {
        if (name === undefined || name === null || name === '')
            name = 'dev';
        for (var _i = 0, _a = this.builds; _i < _a.length; _i++) {
            var build = _a[_i];
            if (build.name === name)
                return build;
        }
    };
    MateConfig.prototype.setUndefined = function () {
        var devBuildExists = false;
        this.builds.forEach(function (build) {
            if (build.name === 'dev')
                devBuildExists = true;
            MateConfigBuild.setUndefined(build);
        });
        if (!devBuildExists) {
            var devBuild = new MateConfigBuild('dev');
            MateConfigBuild.setUndefined(devBuild);
            this.builds.push(devBuild);
        }
        this.files.forEach(function (file) {
            if (file.builds === undefined) {
                file.builds = [];
                file.builds.push('dev');
            }
        });
    };
    return MateConfig;
}());
exports.MateConfig = MateConfig;
var MateConfigFile = (function () {
    function MateConfigFile() {
    }
    MateConfigFile.hasExtension = function (input, extension) {
        var mathExpression = new RegExp('\\.' + extension + '$');
        for (var _i = 0, input_1 = input; _i < input_1.length; _i++) {
            var path = input_1[_i];
            for (var _a = 0, _b = glob.sync(path); _a < _b.length; _a++) {
                var file = _b[_a];
                if (file.match(mathExpression))
                    return true;
            }
        }
        return false;
    };
    return MateConfigFile;
}());
exports.MateConfigFile = MateConfigFile;
var MateConfigBuild = (function () {
    function MateConfigBuild(_name) {
        this.name = _name;
    }
    MateConfigBuild.setUndefined = function (build) {
        if (!build.outDirVersioning)
            build.outDirVersioning = false;
        if (!build.outDirName)
            build.outDirName = false;
        if (build.css === undefined)
            build.css = new MateConfigCSSConfig();
        MateConfigCSSConfig.setUndefined(build.css);
        if (build.js === undefined)
            build.js = new MateConfigJSConfig();
        MateConfigJSConfig.setUndefined(build.js);
        if (build.ts === undefined)
            build.ts = new MateConfigTSConfig();
        MateConfigTSConfig.setUndefined(build.ts);
    };
    return MateConfigBuild;
}());
exports.MateConfigBuild = MateConfigBuild;
var MateConfigBaseConfig = (function () {
    function MateConfigBaseConfig() {
    }
    return MateConfigBaseConfig;
}());
exports.MateConfigBaseConfig = MateConfigBaseConfig;
var MateConfigCSSConfig = (function (_super) {
    __extends(MateConfigCSSConfig, _super);
    function MateConfigCSSConfig() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MateConfigCSSConfig.setUndefined = function (css) {
        if (css.minify === undefined)
            css.minify = true;
        if (css.sourceMap === undefined)
            css.sourceMap = false;
    };
    return MateConfigCSSConfig;
}(MateConfigBaseConfig));
exports.MateConfigCSSConfig = MateConfigCSSConfig;
var MateConfigJSConfig = (function (_super) {
    __extends(MateConfigJSConfig, _super);
    function MateConfigJSConfig() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MateConfigJSConfig.setUndefined = function (js) {
        if (js.minify === undefined)
            js.minify = true;
        if (js.sourceMap === undefined)
            js.sourceMap = true;
        if (js.declaration === undefined)
            js.declaration = true;
        if (js.webClean === undefined)
            js.webClean = false;
    };
    return MateConfigJSConfig;
}(MateConfigBaseConfig));
exports.MateConfigJSConfig = MateConfigJSConfig;
var MateConfigTSConfig = (function (_super) {
    __extends(MateConfigTSConfig, _super);
    function MateConfigTSConfig() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MateConfigTSConfig.declarationCompilerOptions = function (compilerOptions) {
        var value = {};
        for (var key in compilerOptions)
            value[key] = compilerOptions[key];
        value.declaration = true;
        return value;
    };
    MateConfigTSConfig.setUndefined = function (ts) {
        if (ts.compilerOptions === undefined)
            ts.compilerOptions = {};
    };
    return MateConfigTSConfig;
}(MateConfigBaseConfig));
exports.MateConfigTSConfig = MateConfigTSConfig;
var MateConfigFormatterConfig = (function () {
    function MateConfigFormatterConfig() {
    }
    return MateConfigFormatterConfig;
}());
exports.MateConfigFormatterConfig = MateConfigFormatterConfig;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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SyxDQUFDLEdBQUcsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVyRSxLQUFLLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUV6QixPQUFPLEtBQUssQ0FBQztJQUNkLENBQUM7SUFFTSwrQkFBWSxHQUFuQixVQUFvQixFQUFzQjtRQUN6QyxJQUFJLEVBQUUsQ0FBQyxlQUFlLEtBQUssU0FBUztZQUFFLEVBQUUsQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO0lBQy9ELENBQUM7SUFDRix5QkFBQztBQUFELENBaEJBLEFBZ0JDLENBaEJ1QyxvQkFBb0IsR0FnQjNEO0FBaEJZLGdEQUFrQjtBQWtCL0I7SUFBQTtJQUVBLENBQUM7SUFBRCxnQ0FBQztBQUFELENBRkEsQUFFQyxJQUFBO0FBRlksOERBQXlCIiwiZmlsZSI6ImNvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5pbXBvcnQgZ2xvYiA9IHJlcXVpcmUoJ2dsb2InKTtcbmltcG9ydCB7IGNvc21pY29uZmlnU3luYyB9IGZyb20gJ2Nvc21pY29uZmlnJztcbmltcG9ydCB7IENvc21pY29uZmlnUmVzdWx0IH0gZnJvbSAnY29zbWljb25maWcvZGlzdC90eXBlcyc7XG5cbmV4cG9ydCBjbGFzcyBNYXRlQ29uZmlnIHtcblx0cHJpdmF0ZSBzdGF0aWMgX2NvbmZpZ3VyYXRpb25FeHBsb3Jlcjtcblx0cHJpdmF0ZSBzdGF0aWMgZ2V0IGNvbmZpZ3VyYXRpb25FeHBsb3JlcigpIHtcblx0XHRpZiAodGhpcy5fY29uZmlndXJhdGlvbkV4cGxvcmVyICE9PSB1bmRlZmluZWQpIHJldHVybiB0aGlzLl9jb25maWd1cmF0aW9uRXhwbG9yZXI7XG5cblx0XHR0aGlzLl9jb25maWd1cmF0aW9uRXhwbG9yZXIgPSBjb3NtaWNvbmZpZ1N5bmMoJ21hdGVjb25maWcnLCB7XG5cdFx0XHRzZWFyY2hQbGFjZXM6IFtcblx0XHRcdFx0Jy5tYXRlY29uZmlnJyxcblx0XHRcdFx0Jy5tYXRlY29uZmlnLmpzb24nLFxuXHRcdFx0XHQnLm1hdGVjb25maWcueWFtbCcsXG5cdFx0XHRcdCcubWF0ZWNvbmZpZy55bWwnLFxuXHRcdFx0XHQnLm1hdGVjb25maWcuanMnLFxuXHRcdFx0XHQnbWF0ZWNvbmZpZy5qc29uJywgLy8gRGVwcmVjYXRlZFxuXHRcdFx0XHQncGFja2FnZS5qc29uJyxcblx0XHRcdF0sXG5cdFx0XHR0cmFuc2Zvcm06IChyZXN1bHQpID0+IHtcblx0XHRcdFx0aWYgKCFyZXN1bHQgfHwgIXJlc3VsdC5jb25maWcpIHJldHVybiByZXN1bHQ7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiByZXN1bHQuY29uZmlnICE9PSAnb2JqZWN0JykgdGhyb3cgbmV3IEVycm9yKGBDb25maWcgaXMgb25seSBhbGxvd2VkIHRvIGJlIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkICR7dHlwZW9mIHJlc3VsdC5jb25maWd9IGluIFwiJHtyZXN1bHQuZmlsZXBhdGh9XCJgKTtcblxuXHRcdFx0XHRkZWxldGUgcmVzdWx0LmNvbmZpZy4kc2NoZW1hO1xuXG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9LFxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHRoaXMuX2NvbmZpZ3VyYXRpb25FeHBsb3Jlcjtcblx0fVxuXG5cdHN0YXRpYyBnZXQgYXZhaWxhYmxlQ29uZmlndXJhdGlvbkZpbGUoKTogc3RyaW5nIHtcblx0XHRjb25zdCBleHBsb3JlciA9IHRoaXMuY29uZmlndXJhdGlvbkV4cGxvcmVyO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IGV4cGxvcmVyLnNlYXJjaCgpO1xuXHRcdFx0cmV0dXJuIHJlc3VsdC5maWxlcGF0aDtcblx0XHR9IGNhdGNoIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignQ29uZmlndXJhdGlvbiBmaWxlIHdhcyBub3QgZm91bmQuJyk7XG5cdFx0fVxuXHR9XG5cblx0c3RhdGljIGdldCgpOiBNYXRlQ29uZmlnIHtcblx0XHRjb25zdCBjb25maWd1cmF0aW9uRmlsZSA9IE1hdGVDb25maWcuYXZhaWxhYmxlQ29uZmlndXJhdGlvbkZpbGU7XG5cblx0XHRpZiAoIWNvbmZpZ3VyYXRpb25GaWxlKSByZXR1cm4gbnVsbDtcblxuXHRcdGxldCBjb25maWdKc29uOiBNYXRlQ29uZmlnO1xuXG5cdFx0Y29uc3QgcmVzdWx0OiBDb3NtaWNvbmZpZ1Jlc3VsdCA9IHRoaXMuY29uZmlndXJhdGlvbkV4cGxvcmVyLmxvYWQoY29uZmlndXJhdGlvbkZpbGUpO1xuXHRcdGNvbmZpZ0pzb24gPSByZXN1bHQuY29uZmlnO1xuXG5cdFx0aWYgKCFjb25maWdKc29uKSB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIHBhcnNpbmcgY29uZmlndXJhdGlvbiBmaWxlLicpO1xuXG5cdFx0bGV0IGNvbmZpZyA9IG5ldyBNYXRlQ29uZmlnKGNvbmZpZ0pzb24ubmFtZSwgY29uZmlnSnNvbi52ZXJzaW9uLCBjb25maWdKc29uLmZpbGVzLCBjb25maWdKc29uLmJ1aWxkcyk7XG5cdFx0Y29uZmlnLmZvcm1hdCA9IGNvbmZpZ0pzb24uZm9ybWF0O1xuXG5cdFx0Y29uZmlnLnNldFVuZGVmaW5lZCgpO1xuXHRcdHJldHVybiBjb25maWc7XG5cdH1cblxuXHRwcml2YXRlIGNvbnN0cnVjdG9yKF9uYW1lOiBzdHJpbmcsIF92ZXJzaW9uOiBzdHJpbmcsIF9maWxlczogTWF0ZUNvbmZpZ0ZpbGVbXSwgX2J1aWxkczogTWF0ZUNvbmZpZ0J1aWxkW10pIHtcblx0XHR0aGlzLm5hbWUgPSBfbmFtZTtcblx0XHR0aGlzLnZlcnNpb24gPSBfdmVyc2lvbjtcblx0XHR0aGlzLmZpbGVzID0gX2ZpbGVzO1xuXHRcdHRoaXMuYnVpbGRzID0gX2J1aWxkcztcblxuXHRcdGlmICh0aGlzLmJ1aWxkcyA9PT0gdW5kZWZpbmVkKSB0aGlzLmJ1aWxkcyA9IFtdO1xuXHR9XG5cblx0bmFtZT86IHN0cmluZztcblx0dmVyc2lvbj86IHN0cmluZztcblx0ZmlsZXM6IE1hdGVDb25maWdGaWxlW107XG5cdGJ1aWxkczogTWF0ZUNvbmZpZ0J1aWxkW107XG5cdGZvcm1hdD86IE1hdGVDb25maWdGb3JtYXR0ZXJDb25maWc7XG5cblx0cHJpdmF0ZSBwYWNrYWdlOiBvYmplY3Q7XG5cdHByaXZhdGUgc2V0UGFja2FnZSgpIHtcblx0XHR0aGlzLnBhY2thZ2UgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYygncGFja2FnZS5qc29uJykudG9TdHJpbmcoKSk7XG5cdH1cblxuXHRwcml2YXRlIGdldFBhY2thZ2VJbmZvKGluZm86IHN0cmluZykge1xuXHRcdGlmICghdGhpcy5wYWNrYWdlKSB0aGlzLnNldFBhY2thZ2UoKTtcblxuXHRcdHJldHVybiB0aGlzLnBhY2thZ2VbaW5mb107XG5cdH1cblxuXHRnZXRPdXREaXJOYW1lKCk6IHN0cmluZyB7XG5cdFx0aWYgKHRoaXMubmFtZSkgcmV0dXJuIHRoaXMubmFtZTtcblxuXHRcdGlmICh0aGlzLmdldFBhY2thZ2VJbmZvKCduYW1lJykpIHJldHVybiB0aGlzLmdldFBhY2thZ2VJbmZvKCduYW1lJyk7XG5cblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cblx0Z2V0T3V0RGlyVmVyc2lvbigpOiBzdHJpbmcge1xuXHRcdGlmICh0aGlzLnZlcnNpb24pIHJldHVybiB0aGlzLnZlcnNpb247XG5cblx0XHRpZiAodGhpcy5nZXRQYWNrYWdlSW5mbygndmVyc2lvbicpKSByZXR1cm4gdGhpcy5nZXRQYWNrYWdlSW5mbygndmVyc2lvbicpO1xuXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxuXG5cdGdldEJ1aWxkKG5hbWU6IHN0cmluZyk6IE1hdGVDb25maWdCdWlsZCB7XG5cdFx0aWYgKG5hbWUgPT09IHVuZGVmaW5lZCB8fCBuYW1lID09PSBudWxsIHx8IG5hbWUgPT09ICcnKSBuYW1lID0gJ2Rldic7XG5cblx0XHRmb3IgKGNvbnN0IGJ1aWxkIG9mIHRoaXMuYnVpbGRzKSBpZiAoYnVpbGQubmFtZSA9PT0gbmFtZSkgcmV0dXJuIGJ1aWxkO1xuXHR9XG5cblx0c2V0VW5kZWZpbmVkKCk6IHZvaWQge1xuXHRcdC8vIEJ1aWxkc1xuXG5cdFx0bGV0IGRldkJ1aWxkRXhpc3RzID0gZmFsc2U7XG5cblx0XHR0aGlzLmJ1aWxkcy5mb3JFYWNoKChidWlsZDogTWF0ZUNvbmZpZ0J1aWxkKSA9PiB7XG5cdFx0XHRpZiAoYnVpbGQubmFtZSA9PT0gJ2RldicpIGRldkJ1aWxkRXhpc3RzID0gdHJ1ZTtcblxuXHRcdFx0TWF0ZUNvbmZpZ0J1aWxkLnNldFVuZGVmaW5lZChidWlsZCk7XG5cdFx0fSk7XG5cblx0XHRpZiAoIWRldkJ1aWxkRXhpc3RzKSB7XG5cdFx0XHRjb25zdCBkZXZCdWlsZCA9IG5ldyBNYXRlQ29uZmlnQnVpbGQoJ2RldicpO1xuXHRcdFx0TWF0ZUNvbmZpZ0J1aWxkLnNldFVuZGVmaW5lZChkZXZCdWlsZCk7XG5cblx0XHRcdHRoaXMuYnVpbGRzLnB1c2goZGV2QnVpbGQpO1xuXHRcdH1cblxuXHRcdC8vIEZpbGVzXG5cblx0XHR0aGlzLmZpbGVzLmZvckVhY2goKGZpbGU6IE1hdGVDb25maWdGaWxlKSA9PiB7XG5cdFx0XHRpZiAoZmlsZS5idWlsZHMgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRmaWxlLmJ1aWxkcyA9IFtdO1xuXHRcdFx0XHRmaWxlLmJ1aWxkcy5wdXNoKCdkZXYnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgTWF0ZUNvbmZpZ0ZpbGUge1xuXHRpbnB1dDogc3RyaW5nW107XG5cdG91dHB1dDogc3RyaW5nW107XG5cdGJ1aWxkcz86IHN0cmluZ1tdO1xuXG5cdHN0YXRpYyBoYXNFeHRlbnNpb24oaW5wdXQ6IHN0cmluZ1tdLCBleHRlbnNpb246IHN0cmluZyk6IGJvb2xlYW4ge1xuXHRcdGNvbnN0IG1hdGhFeHByZXNzaW9uID0gbmV3IFJlZ0V4cCgnXFxcXC4nICsgZXh0ZW5zaW9uICsgJyQnKTtcblxuXHRcdGZvciAoY29uc3QgcGF0aCBvZiBpbnB1dClcblx0XHRcdGZvciAoY29uc3QgZmlsZSBvZiBnbG9iLnN5bmMocGF0aCkpIHtcblx0XHRcdFx0aWYgKGZpbGUubWF0Y2gobWF0aEV4cHJlc3Npb24pKSByZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgTWF0ZUNvbmZpZ0J1aWxkIHtcblx0bmFtZTogc3RyaW5nO1xuXHRvdXREaXI/OiBzdHJpbmc7XG5cdG91dERpclZlcnNpb25pbmc/OiBib29sZWFuO1xuXHRvdXREaXJOYW1lPzogYm9vbGVhbjtcblx0Y3NzPzogTWF0ZUNvbmZpZ0NTU0NvbmZpZztcblx0anM/OiBNYXRlQ29uZmlnSlNDb25maWc7XG5cdHRzPzogTWF0ZUNvbmZpZ1RTQ29uZmlnO1xuXG5cdGNvbnN0cnVjdG9yKF9uYW1lOiBzdHJpbmcpIHtcblx0XHR0aGlzLm5hbWUgPSBfbmFtZTtcblx0fVxuXG5cdHN0YXRpYyBzZXRVbmRlZmluZWQoYnVpbGQ6IE1hdGVDb25maWdCdWlsZCk6IHZvaWQge1xuXHRcdGlmICghYnVpbGQub3V0RGlyVmVyc2lvbmluZykgYnVpbGQub3V0RGlyVmVyc2lvbmluZyA9IGZhbHNlO1xuXG5cdFx0aWYgKCFidWlsZC5vdXREaXJOYW1lKSBidWlsZC5vdXREaXJOYW1lID0gZmFsc2U7XG5cblx0XHQvLyBDU1NcblxuXHRcdGlmIChidWlsZC5jc3MgPT09IHVuZGVmaW5lZCkgYnVpbGQuY3NzID0gbmV3IE1hdGVDb25maWdDU1NDb25maWcoKTtcblxuXHRcdE1hdGVDb25maWdDU1NDb25maWcuc2V0VW5kZWZpbmVkKGJ1aWxkLmNzcyk7XG5cblx0XHQvLyBKU1xuXG5cdFx0aWYgKGJ1aWxkLmpzID09PSB1bmRlZmluZWQpIGJ1aWxkLmpzID0gbmV3IE1hdGVDb25maWdKU0NvbmZpZygpO1xuXG5cdFx0TWF0ZUNvbmZpZ0pTQ29uZmlnLnNldFVuZGVmaW5lZChidWlsZC5qcyk7XG5cblx0XHQvLyBUU1xuXG5cdFx0aWYgKGJ1aWxkLnRzID09PSB1bmRlZmluZWQpIGJ1aWxkLnRzID0gbmV3IE1hdGVDb25maWdUU0NvbmZpZygpO1xuXG5cdFx0TWF0ZUNvbmZpZ1RTQ29uZmlnLnNldFVuZGVmaW5lZChidWlsZC50cyk7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIE1hdGVDb25maWdCYXNlQ29uZmlnIHtcblx0b3V0RGlyU3VmZml4Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgTWF0ZUNvbmZpZ0NTU0NvbmZpZyBleHRlbmRzIE1hdGVDb25maWdCYXNlQ29uZmlnIHtcblx0bWluaWZ5PzogYm9vbGVhbjtcblx0c291cmNlTWFwPzogYm9vbGVhbjtcblxuXHRzdGF0aWMgc2V0VW5kZWZpbmVkKGNzczogTWF0ZUNvbmZpZ0NTU0NvbmZpZyk6IHZvaWQge1xuXHRcdGlmIChjc3MubWluaWZ5ID09PSB1bmRlZmluZWQpIGNzcy5taW5pZnkgPSB0cnVlO1xuXG5cdFx0aWYgKGNzcy5zb3VyY2VNYXAgPT09IHVuZGVmaW5lZCkgY3NzLnNvdXJjZU1hcCA9IGZhbHNlO1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBNYXRlQ29uZmlnSlNDb25maWcgZXh0ZW5kcyBNYXRlQ29uZmlnQmFzZUNvbmZpZyB7XG5cdG1pbmlmeT86IGJvb2xlYW47XG5cdHNvdXJjZU1hcD86IGJvb2xlYW47XG5cdGRlY2xhcmF0aW9uPzogYm9vbGVhbjtcblx0d2ViQ2xlYW4/OiBib29sZWFuO1xuXG5cdHN0YXRpYyBzZXRVbmRlZmluZWQoanM6IE1hdGVDb25maWdKU0NvbmZpZyk6IHZvaWQge1xuXHRcdGlmIChqcy5taW5pZnkgPT09IHVuZGVmaW5lZCkganMubWluaWZ5ID0gdHJ1ZTtcblxuXHRcdGlmIChqcy5zb3VyY2VNYXAgPT09IHVuZGVmaW5lZCkganMuc291cmNlTWFwID0gdHJ1ZTtcblxuXHRcdGlmIChqcy5kZWNsYXJhdGlvbiA9PT0gdW5kZWZpbmVkKSBqcy5kZWNsYXJhdGlvbiA9IHRydWU7XG5cblx0XHRpZiAoanMud2ViQ2xlYW4gPT09IHVuZGVmaW5lZCkganMud2ViQ2xlYW4gPSBmYWxzZTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgTWF0ZUNvbmZpZ1RTQ29uZmlnIGV4dGVuZHMgTWF0ZUNvbmZpZ0Jhc2VDb25maWcge1xuXHRjb21waWxlck9wdGlvbnM/OiB0c0NvbXBpbGVyT3B0aW9ucztcblxuXHRzdGF0aWMgZGVjbGFyYXRpb25Db21waWxlck9wdGlvbnMoY29tcGlsZXJPcHRpb25zPzogdHNDb21waWxlck9wdGlvbnMpOiB0c0NvbXBpbGVyT3B0aW9ucyB7XG5cdFx0dmFyIHZhbHVlOiB0c0NvbXBpbGVyT3B0aW9ucyA9IHt9O1xuXG5cdFx0Zm9yIChjb25zdCBrZXkgaW4gY29tcGlsZXJPcHRpb25zKSB2YWx1ZVtrZXldID0gY29tcGlsZXJPcHRpb25zW2tleV07XG5cblx0XHR2YWx1ZS5kZWNsYXJhdGlvbiA9IHRydWU7XG5cblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cblxuXHRzdGF0aWMgc2V0VW5kZWZpbmVkKHRzOiBNYXRlQ29uZmlnVFNDb25maWcpOiB2b2lkIHtcblx0XHRpZiAodHMuY29tcGlsZXJPcHRpb25zID09PSB1bmRlZmluZWQpIHRzLmNvbXBpbGVyT3B0aW9ucyA9IHt9O1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBNYXRlQ29uZmlnRm9ybWF0dGVyQ29uZmlnIHtcblx0cGF0aDogc3RyaW5nIHwgc3RyaW5nW107XG59XG5cbmludGVyZmFjZSB0c0NvbXBpbGVyT3B0aW9ucyB7XG5cdC8vIHRvIGJlIGlnbm9yZWRcblx0ZGVjbGFyYXRpb24/OiBib29sZWFuO1xuXHRzb3VyY2VNYXA/OiBib29sZWFuO1xuXHRvdXREaXI/OiBzdHJpbmc7XG5cdG91dEZpbGU/OiBzdHJpbmc7XG59XG4iXX0=
