import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-country-dropdown',
  templateUrl: './country-dropdown.component.html',
  styleUrls: ['./country-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryDropdownComponent implements OnInit {
  @Output() handleCountryChanged: EventEmitter<string> = new EventEmitter();

  ngOnInit(): void {}
  constructor(private cdr: ChangeDetectorRef) {}

  @Input()
  set selectedCountry(selected: string){
    this.chosenCountry = selected;
    this.cdr.detectChanges();
  };

  public chosenCountry: string = 'All';

  @Input()
  countries: ReadonlyArray<string> = [];

  public onChooseCountry(country: string) {
    this.chosenCountry = country;
    this.handleCountryChanged.emit(country);
  }
}
