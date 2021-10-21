import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { BlizzardApiService } from "src/app/services/blizzard-api.service";

@Component({
    selector: "app-info",
    templateUrl: "./info.component.html",
    styleUrls: ["./info.component.css"],
})
export class InfoComponent implements OnInit, OnDestroy {
    charDetails: any;
    charDetailsSubscription: Subscription;

    constructor(private blizzardApiService: BlizzardApiService) {}

    ngOnInit() {
        this.charDetails = this.blizzardApiService.charDetails;
        this.charDetailsSubscription =
            this.blizzardApiService.charDetailsSubject.subscribe(
                (charDetails) => {
                    this.charDetails = charDetails;
                }
            );
    }

    getClass = (classId) => {
        switch (classId) {
            case 1:
                return "warrior";
            case 2:
                return "paladin";
            case 3:
                return "hunter";
            case 4:
                return "rogue";
            case 5:
                return "priest";
            case 6:
                return "deathknight";
            case 7:
                return "shaman";
            case 8:
                return "mage";
            case 9:
                return "warlock";
            case 10:
                return "monk";
            case 11:
                return "druid";
            case 12:
                return "demon_hunter";
            default:
                return "not-found";
        }
    };

    getClassColor = (classId) => {
        switch (classId) {
            case 1:
                return "#C79C6E";
            case 2:
                return "#F58CBA";
            case 3:
                return "#ABD473";
            case 4:
                return "#FFF569";
            case 5:
                return "#FFFFFF";
            case 6:
                return "#C41F3B";
            case 7:
                return "#0070DE";
            case 8:
                return "#69CCF0";
            case 9:
                return "#9482C9";
            case 10:
                return "#00FF96";
            case 11:
                return "#FF7D0A";
            case 12:
                return "#A330C9";
            default:
                return "#FFFFFF";
        }
    };

    ngOnDestroy() {
        this.charDetailsSubscription.unsubscribe();
    }
}
