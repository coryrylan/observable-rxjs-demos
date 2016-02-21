import {Component} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {FORM_PROVIDERS, FormBuilder, Validators} from 'angular2/common';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

@Component({
    selector: 'demo-app',
    templateUrl: 'src/app.html'
})
export class App {
    searchForm: any;
    results$: Observable<any>;

    constructor(private _formBuilder: FormBuilder, private _http: Http) {
        const API_URL = 'https://www.googleapis.com/youtube/v3/search';
        const API_KEY = '';

        this.searchForm = this._formBuilder.group({
            'search': ['', Validators.required]
        });

        this.results$ = this.searchForm.controls.search.valueChanges // <- Observable Form
            .debounceTime(500)
            .switchMap(query => this._http.get(`${API_URL}?q=${query}&key=${API_KEY}&part=snippet`))  // <-- Observable Http
            .map(res => res.json())
            .map(res => res.items);
    }
}

bootstrap(App, [
    FORM_PROVIDERS,
    HTTP_PROVIDERS
]);
