import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material/material.module";
import { AppRoutingModule } from "./app-routing.module";
import { OverlayModule } from "@angular/cdk/overlay";

import { BlizzardApiService } from "./services/blizzard-api.service";

import { AppComponent } from "./app.component";
import { ServerListComponent } from "./server-list/server-list.component";
import { HeaderComponent } from "./header/header.component";
import { CharDetailsComponent } from "./char-details/char-details.component";
import { SearchBarComponent } from "./search-bar/search-bar.component";
import { PvpComponent } from "./cards/pvp/pvp.component";
import { InfoComponent } from "./cards/info/info.component";
import { TalentsComponent } from "./cards/talents/talents.component";
import { GearComponent } from "./cards/gear/gear.component";
import { StatisticsComponent } from "./cards/statistics/statistics.component";

@NgModule({
    declarations: [
        AppComponent,
        ServerListComponent,
        HeaderComponent,
        CharDetailsComponent,
        SearchBarComponent,
        PvpComponent,
        InfoComponent,
        TalentsComponent,
        GearComponent,
        StatisticsComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        OverlayModule,
    ],
    providers: [BlizzardApiService],
    bootstrap: [AppComponent],
})
export class AppModule {}
