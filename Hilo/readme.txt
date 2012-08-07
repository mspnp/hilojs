Asynchronous Programming in WinJS
--------------------------------

WinJS implements the [Common JS Promises/A][1] proposal. In brief, asynchronous 
operations are encompassed in an object called a _promise_. The promise object
is not the value returned from the async operation, instead is a "promise" to
return the value when the value becomes available. The most commonly used method
on a promise object is [`then`][2]. The first parameter of `then` is a function to 
be invoked once the promise is fulfilled.

A general discussion of [asynchronous programming in JavaScript][3] is available on 
Dev Center.

Promises are frequently chained together. This occurs when several async operations
need to occur in tandem. More information about [chaining promises][4] can be found on 
Dev Center.

[1]: http://wiki.commonjs.org/wiki/Promises
[2]: http://msdn.microsoft.com/en-us/library/windows/apps/br229728.aspx
[3]: http://msdn.microsoft.com/en-us/library/windows/apps/hh700330.aspx
[4]: http://msdn.microsoft.com/en-us/library/windows/apps/Hh700334.aspx