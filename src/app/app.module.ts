import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
// i added this only so the buttons look nicer.
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { ContactsSummaryComponent } from './contacts-summery/contacts-summary.component';
import { ContactsComponent } from './contacts/contacts.component';
import { DetailsShowComponent } from './details-show/details-show.component';
import { InfoSummaryComponent } from './info-summary/info-summary.component';
import { PhoneSyntaxPipe } from './services/phone-syntax.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ContactsComponent,
    ContactsSummaryComponent,
    InfoSummaryComponent,
    DetailsShowComponent,
    PhoneSyntaxPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
