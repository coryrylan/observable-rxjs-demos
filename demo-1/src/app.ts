import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

console.clear();

//#region Example 1
let promise = new Promise(resolve => {
    setTimeout(() => {
        resolve('promise timeout');
    }, 2000)
});

promise.then(value => console.log(value));

let stream1$ = new Observable(observer => {
    let timeout = setTimeout(() => {
        observer.next('observable timeout');
    }, 2000);

    return () => {
        clearTimeout(timeout);
    }
});

let disposable = stream1$.subscribe(value => console.log(value));
setTimeout(() => {
    disposable.unsubscribe();
}, 1000);
//#endregion

//#region Example 2
let stream2$ = new Observable(observer => {
    let count = 0;
    let interval = setInterval(() => {
        observer.next(count++);
    }, 1000);

    return () => {
        clearInterval(interval);
    }
});

// stream2$
//   .filter(value => value % 2 == 0)
//   .subscribe(value => console.log(value));

// ----1----2----3----4--->
//          filter
// ---------2---------4--->

// stream2$
//   .map(value => value * value)
//   .subscribe(value => console.log(value));
  
// ----1----2----3----4--->
//      map => x * x
// ----1----4----9----16--->
//#endregion

//#region Example 3
let incrementBtn = document.getElementById('increment');
let decrementBtn = document.getElementById('decrement');
let counter = document.getElementById('counter');

let incrementClick$ = new Observable.fromEvent(incrementBtn, 'click');
let decrementClick$ = new Observable.fromEvent(decrementBtn, 'click');

let clicks$ = new Observable
    .merge(incrementClick$, decrementClick$)
    .map(event => parseInt(event.target.value, 10));

let total$ = clicks$
    .scan((total, value) => total + value, 0);

total$.subscribe(total => {
    counter.innerText = total;
});


// ----i------------------>
// -------d---------d----->
//          merge
// ----i--d---------d----->
//           map
// ----p--n---------n----->
//           scan
// 0---1--0-------(-1)---->
//#endregion