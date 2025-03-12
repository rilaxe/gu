import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AccessPinComponent } from './access-pin.component';
import { AccessPinRoutingModule } from './access-pin-routing.module';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, AccessPinRoutingModule],
    declarations: [AccessPinComponent],
})
export class AccessPinModule {}