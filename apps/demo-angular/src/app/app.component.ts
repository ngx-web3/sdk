import { Component } from '@angular/core';

@Component({
  selector: 'ngx-web3-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'demo-angular';
  amount = 0.01;
  symbol = 'BNB';
}
