import { Injectable } from '@angular/core';
import {Location} from "@angular/common";
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'app/additional-components/confirmation-dialog/confirmation-dialog.component';
@Injectable({
    providedIn: 'root',
})
export class TranslationService {
    id:any;
    location: Location;
    lang: boolean = false;
    constructor(location: Location, public dialog: MatDialog) {
        this.location = location
        let x = localStorage.getItem('a');
        if (x === 'ar') {
            console.log(this.lang)
            this.lang = true;
        } else if(this.id === 'ay'){
            localStorage.removeItem(x);
        }
    }

    loadTranslationScript(): void {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        const existingDiv = document.getElementById('google_translate_element');
        existingDiv?.appendChild(script);
    }

    select(event) {
        this.id  = event.target.value;
        localStorage.setItem('a',this.id );
        const storedEventTargetValue = localStorage.getItem('a');
        console.log(storedEventTargetValue);
        if ( this.id === '') {
            console.log('no value');
        } else {
            if ( this.id === 'ar') {
                this.lang = true;
            } else {
                this.lang = false;
            }
        }

    }
}