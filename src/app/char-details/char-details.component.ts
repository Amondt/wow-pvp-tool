import { Component, OnDestroy, OnInit } from "@angular/core";
import { BlizzardApiService } from "../services/blizzard-api.service";
import { Subscription } from "rxjs";

@Component({
    selector: "app-char-details",
    templateUrl: "./char-details.component.html",
    styleUrls: ["./char-details.component.css"],
})
export class CharDetailsComponent implements OnInit, OnDestroy {
    isFetchingCharDetailsSubscription: Subscription;
    isFetchingCharDetails: boolean;

    charDetails: any;
    charDetailsSubscription: Subscription;

    constructor(private blizzardApiService: BlizzardApiService) {}

    ngOnInit() {
        this.isFetchingCharDetails =
            this.blizzardApiService.isFetchingCharDetails;
        this.isFetchingCharDetailsSubscription =
            this.blizzardApiService.isFetchingCharDetailsSubject.subscribe(
                (isFetching) => {
                    this.isFetchingCharDetails = isFetching;
                }
            );

        this.charDetails = this.blizzardApiService.charDetails;

        this.charDetailsSubscription =
            this.blizzardApiService.charDetailsSubject.subscribe(
                (charDetails) => {
                    this.charDetails = charDetails;
                }
            );
    }

    ngOnDestroy() {
        this.isFetchingCharDetailsSubscription.unsubscribe();
        this.charDetailsSubscription.unsubscribe();
    }
}
