describe('The require function (or service locator)', function () {

    it('should exist', function () {
        expect(require).toBeDefined();
    });

    it('should return the Windows object when passed "Windows"', function () {
        var service = require('Windows');
        expect(service).toBe(Windows);
    });

    it('should resolve nested objects, such as "Windows.Storage.Search"', function () {
        var service = require('Windows.Storage.Search');
        expect(service).toBe(Windows.Storage.Search);
    });

    it('should throw when the service does not exist', function () {
        expect(function () { require('NotReal'); }).toThrow(new Error('unable to locate NotReal'));
    });

    it('should return the correct error message for nested objects when the service does not exist', function () {
        expect(function () { require('Not.Real.Object'); }).toThrow(new Error('unable to locate Not.Real.Object'));
    });

    it('should invoke a resovled function when it is marked as a factory', function () {
        var target = {};
        window.myFactory = function () {
            return target;
        };
        window.myFactory.isFactory = true;

        expect(require('myFactory')).toBe(target);
    });

    it('should not invoke a resovled function when it is not marked as a factory', function () {
        var target = {};
        window.myFactory = function () {
            return target;
        };

        expect(typeof require('myFactory')).toBe('function');
    });

    it('should only invoke a factory once, even when required multiple times', function () {
        var count = 0;
        window.myFactory = function () {
            count++;
            return {};
        };
        window.myFactory.isFactory = true;

        require('myFactory');
        require('myFactory');

        expect(count).toBe(1);
    });

    describe('when called from a mock context', function () {
        it('should resolve a nested depdency from the originating context', function () {
            var mock = new Hilo.specs.helpers.mocking().handle;
            mock('Some.Dependency', {
                property: 'value'
            });

            var factory = function (require) {
                var dependency = require('Some.Dependency');
                expect(dependency.property).toBe('value');
            };

            var module = factory(mock.require);
        });


        it('should to atempt resolve from the global context, if unable to resolve from mock context', function () {
            var mock = new Hilo.specs.helpers.mocking().handle;

            var factory = function (require) {
                var dependency = require('WinJS.Promise');
                expect(dependency).toBe(WinJS.Promise);
            };

            var module = factory(mock.require);
        });
    });
});