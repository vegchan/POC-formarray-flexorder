import { Component } from "@angular/core";
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { combineLatest, Subscription } from "rxjs";
import { debounceTime, map } from "rxjs/operators";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  name = "Angular";
  formGroup: FormGroup;
  subscription: Subscription;
  faPlus = faPlus;
  faTrash = faTrash;
  arrayOrder = [];
  constructor(private formBuilder: FormBuilder) {
    this.buildForm();
  }

  get list() {
    return this.formGroup.get("list") as FormArray;
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      list: this.formBuilder.array([this.createArrayElement()])
    });

    this.addSubscription();
  }

  private createArrayElement() {
    return this.formBuilder.group({
      rate: [],
      quantity: [],
      total: [{ value: null, disabled: true }],
      order: []
    });
  }

  addRow(index: number) {
    const formGroup = this.createArrayElement();
    const order = this.arrayOrder[index] + 1;
    this.arrayOrder = this.arrayOrder.map(listOrder =>
      listOrder >= order ? listOrder + 1 : listOrder
    );
    this.arrayOrder.splice(index + 1, 0, order);
    this.list.insert(index + 1, formGroup);
    this.addSubscription();
  }
  removeRow(index: number) {
    if (index > -1) {
      this.list.removeAt(index);
      this.arrayOrder = this.arrayOrder.slice(index, 1);
    }
  }

  private addSubscription() {
    if (this.subscription && this.subscription.closed) {
      this.subscription.unsubscribe();
    }

    this.subscription = new Subscription();

    this.list.controls.forEach(control => {
      let sub = combineLatest(
        control.get("rate").valueChanges,
        control.get("quantity").valueChanges
      )
        .pipe(
          debounceTime(300),
          map(eventArray => ({
            rate: +eventArray[0],
            quantity: +eventArray[1]
          }))
        )
        .subscribe(({ rate, quantity }) => {
          control.get("total").setValue(rate * quantity);
          this.setOrder();
        });

      this.subscription.add(sub);
    });
  }

  private setOrder() {
    const unsorted = this.list.value;
    const sorted = [...unsorted]
      .filter(data => data.rate && data.rate > 0)
      .sort((a, b) => {
        const primaryOrder = a.rate - b.rate;
        return primaryOrder !== 0 ? primaryOrder : a.quantity - b.quantity;
      });
    this.arrayOrder = unsorted.map((elem, index) => {
      const order = sorted.indexOf(elem);
      return order > -1 ? order : index;
    });
    sorted.forEach((elem, index) => {
      if (elem.rate && elem.rate > 0) {
        const order = unsorted.indexOf(elem);
        this.list
          .at(order)
          .get("order")
          .setValue(index);
      }
    });
  }
}
