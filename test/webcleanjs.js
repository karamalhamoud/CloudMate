"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var through = require("through2");
module.exports = function () {
    return through.obj(function (vinylFile, encoding, callback) {
        var transformedFile = vinylFile.clone();
        var lines = transformedFile.contents.toString().split('\n');
        var removables_Requires = [];
        var removables_Lines = [];
        console.log('--------------------------');
        console.log('start ********************');
        console.log('--------------------------');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (line.indexOf(' require(') === -1)
                continue;
            removables_Requires.push(line);
            var prefix = line.split(' ')[1];
            if (prefix.indexOf('_') !== -1)
                removables_Requires.push(prefix + '.');
        }
        var content = 'var exports = {};\n' + transformedFile.contents.toString();
        removables_Requires.forEach(function (value) {
            if (value.indexOf('=') === 0)
                return;
            if (value.indexOf('=') !== -1)
                content = content.replace(value, '');
            else
                content = content.replace(new RegExp(value.trim(), 'gi'), '');
        });
        content = CloudMateWebCleanJS.removeNonDependanciesLines(content);
        console.log('--------------------------');
        console.log('end **********************');
        console.log('--------------------------');
        transformedFile.contents = new Buffer(content);
        callback(null, transformedFile);
    });
};
var CloudMateWebCleanJS = (function () {
    function CloudMateWebCleanJS() {
    }
    CloudMateWebCleanJS.removeNonDependanciesLines = function (content) {
        var startWithValues = [
            'AAObject.defineProperty(exports',
            'AAexports.'
        ];
        var result = '';
        for (var _i = 0, _a = content.split('\n'); _i < _a.length; _i++) {
            var line = _a[_i];
            var safe = true;
            for (var _b = 0, startWithValues_1 = startWithValues; _b < startWithValues_1.length; _b++) {
                var startWith = startWithValues_1[_b];
                if (line.startsWith(startWith))
                    safe = false;
            }
            if (safe)
                result += line + '\n';
        }
        return result;
    };
    return CloudMateWebCleanJS;
}());

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYmNsZWFuanMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxrQ0FBcUM7QUFHckMsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUViLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLFNBQWdCLEVBQUUsUUFBZ0IsRUFBRSxRQUFrQjtRQUsvRSxJQUFNLGVBQWUsR0FBRyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7UUFNMUMsSUFBTSxLQUFLLEdBQUcsZUFBZSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFOUQsSUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7UUFDL0IsSUFBTSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7UUFFNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztRQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFFMUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFFbkMsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBSXRCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2hDLFNBQVM7WUFFYixtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFL0IsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVsQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMxQixtQkFBbUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1NBQzlDO1FBRUQsSUFBSSxPQUFPLEdBQUcscUJBQXFCLEdBQUcsZUFBZSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUUxRSxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsVUFBVSxLQUFLO1lBRXZDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO2dCQUN4QixPQUFPO1lBRVgsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOztnQkFFckMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3RFLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxHQUFHLG1CQUFtQixDQUFDLDBCQUEwQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWxFLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztRQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1FBRTFDLGVBQWUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFHL0MsUUFBUSxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQztJQUVwQyxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQztBQUVGO0lBQUE7SUF5QkEsQ0FBQztJQXZCVSw4Q0FBMEIsR0FBakMsVUFBa0MsT0FBZTtRQUU3QyxJQUFNLGVBQWUsR0FBRztZQUNwQixpQ0FBaUM7WUFDakMsWUFBWTtTQUNmLENBQUM7UUFFRixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFaEIsS0FBa0IsVUFBbUIsRUFBbkIsS0FBQSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFuQixjQUFtQixFQUFuQixJQUFtQixFQUFDO1lBQWxDLElBQU0sSUFBSSxTQUFBO1lBRVYsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBRWhCLEtBQXVCLFVBQWUsRUFBZixtQ0FBZSxFQUFmLDZCQUFlLEVBQWYsSUFBZTtnQkFBbEMsSUFBTSxTQUFTLHdCQUFBO2dCQUNmLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7b0JBQzFCLElBQUksR0FBRyxLQUFLLENBQUM7YUFBQTtZQUVyQixJQUFJLElBQUk7Z0JBQ0osTUFBTSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7U0FDN0I7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBQ0wsMEJBQUM7QUFBRCxDQXpCQSxBQXlCQyxJQUFBIiwiZmlsZSI6IndlYmNsZWFuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdGhyb3VnaCA9IHJlcXVpcmUoJ3Rocm91Z2gyJyk7XHJcbmltcG9ydCB2aW55bCA9IHJlcXVpcmUoJ3ZpbnlsJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICByZXR1cm4gdGhyb3VnaC5vYmooZnVuY3Rpb24gKHZpbnlsRmlsZTogdmlueWwsIGVuY29kaW5nOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbikge1xyXG5cclxuICAgICAgICAvLyAxLiBjbG9uZSBuZXcgdmlueWwgZmlsZSBmb3IgbWFuaXB1bGF0aW9uXHJcbiAgICAgICAgLy8gKFNlZSBodHRwczovL2dpdGh1Yi5jb20vd2VhcmVmcmFjdGFsL3ZpbnlsIGZvciB2aW55bCBhdHRyaWJ1dGVzIGFuZCBmdW5jdGlvbnMpXHJcblxyXG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybWVkRmlsZSA9IHZpbnlsRmlsZS5jbG9uZSgpO1xyXG5cclxuICAgICAgICAvLyAyLiBzZXQgbmV3IGNvbnRlbnRzXHJcbiAgICAgICAgLy8gKiBjb250ZW50cyBjYW4gb25seSBiZSBhIEJ1ZmZlciwgU3RyZWFtLCBvciBudWxsXHJcbiAgICAgICAgLy8gKiBUaGlzIGFsbG93cyB1cyB0byBtb2RpZnkgdGhlIHZpbnlsIGZpbGUgaW4gbWVtb3J5IGFuZCBwcmV2ZW50cyB0aGUgbmVlZCB0byB3cml0ZSBiYWNrIHRvIHRoZSBmaWxlIHN5c3RlbS5cclxuXHJcbiAgICAgICAgY29uc3QgbGluZXMgPSB0cmFuc2Zvcm1lZEZpbGUuY29udGVudHMudG9TdHJpbmcoKS5zcGxpdCgnXFxuJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHJlbW92YWJsZXNfUmVxdWlyZXMgPSBbXTtcclxuICAgICAgICBjb25zdCByZW1vdmFibGVzX0xpbmVzID0gW107XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdzdGFydCAqKioqKioqKioqKioqKioqKioqKicpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBsaW5lc1tpXTtcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxpbmUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGxpbmUuaW5kZXhPZignIHJlcXVpcmUoJykgPT09IC0xKVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICByZW1vdmFibGVzX1JlcXVpcmVzLnB1c2gobGluZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwcmVmaXggPSBsaW5lLnNwbGl0KCcgJylbMV07XHJcblxyXG4gICAgICAgICAgICBpZiAocHJlZml4LmluZGV4T2YoJ18nKSAhPT0gLTEpXHJcbiAgICAgICAgICAgICAgICByZW1vdmFibGVzX1JlcXVpcmVzLnB1c2gocHJlZml4ICsgJy4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBjb250ZW50ID0gJ3ZhciBleHBvcnRzID0ge307XFxuJyArIHRyYW5zZm9ybWVkRmlsZS5jb250ZW50cy50b1N0cmluZygpO1xyXG5cclxuICAgICAgICByZW1vdmFibGVzX1JlcXVpcmVzLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodmFsdWUuaW5kZXhPZignPScpID09PSAwKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgaWYgKHZhbHVlLmluZGV4T2YoJz0nKSAhPT0gLTEpXHJcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlKHZhbHVlLCAnJyk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UobmV3IFJlZ0V4cCh2YWx1ZS50cmltKCksICdnaScpLCAnJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnRlbnQgPSBDbG91ZE1hdGVXZWJDbGVhbkpTLnJlbW92ZU5vbkRlcGVuZGFuY2llc0xpbmVzKGNvbnRlbnQpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnZW5kICoqKioqKioqKioqKioqKioqKioqKionKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuXHJcbiAgICAgICAgdHJhbnNmb3JtZWRGaWxlLmNvbnRlbnRzID0gbmV3IEJ1ZmZlcihjb250ZW50KTtcclxuXHJcbiAgICAgICAgLy8gMy4gcGFzcyBhbG9uZyB0cmFuc2Zvcm1lZCBmaWxlIGZvciB1c2UgaW4gbmV4dCBgcGlwZSgpYFxyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHRyYW5zZm9ybWVkRmlsZSk7XHJcblxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5jbGFzcyBDbG91ZE1hdGVXZWJDbGVhbkpTIHtcclxuXHJcbiAgICBzdGF0aWMgcmVtb3ZlTm9uRGVwZW5kYW5jaWVzTGluZXMoY29udGVudDogc3RyaW5nKTogc3RyaW5ne1xyXG5cclxuICAgICAgICBjb25zdCBzdGFydFdpdGhWYWx1ZXMgPSBbXHJcbiAgICAgICAgICAgICdBQU9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzJyxcclxuICAgICAgICAgICAgJ0FBZXhwb3J0cy4nXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xyXG5cclxuICAgICAgICBmb3IoY29uc3QgbGluZSBvZiBjb250ZW50LnNwbGl0KCdcXG4nKSl7XHJcbiAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgc2FmZSA9IHRydWU7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IoY29uc3Qgc3RhcnRXaXRoIG9mIHN0YXJ0V2l0aFZhbHVlcylcclxuICAgICAgICAgICAgICAgIGlmIChsaW5lLnN0YXJ0c1dpdGgoc3RhcnRXaXRoKSlcclxuICAgICAgICAgICAgICAgICAgICBzYWZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoc2FmZSlcclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSBsaW5lICsgJ1xcbic7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG59Il19
