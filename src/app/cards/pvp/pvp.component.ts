import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { BlizzardApiService } from "src/app/services/blizzard-api.service";

@Component({
    selector: "app-pvp",
    templateUrl: "./pvp.component.html",
    styleUrls: ["./pvp.component.css"],
})
export class PvpComponent implements OnInit, OnDestroy {
    charDetails: any;
    charDetailsSubscription: Subscription;

    brackets = [
        { order: 1, name: "3v3" },
        { order: 0, name: "2v2" },
        { order: 2, name: "RBG" },
    ];

    constructor(private blizzardApiService: BlizzardApiService) {}

    ngOnInit() {
        this.charDetailsSubscription =
            this.blizzardApiService.charDetailsSubject.subscribe(
                (charDetails) => {
                    this.charDetails = charDetails;
                }
            );
        this.charDetails = this.blizzardApiService.charDetails;
    }

    getHighestRating = (bracketId: number) => {
        let highestRating;
        for (const category of this.charDetails.achievements_statistics
            .categories) {
            if (category.id === 21) {
                category.sub_categories[0].statistics.forEach((statistic) => {
                    statistic.id === bracketId &&
                        (highestRating = statistic.quantity);
                });
            }
        }
        return highestRating;
    };

    ngOnDestroy() {
        this.charDetailsSubscription.unsubscribe();
    }
}
