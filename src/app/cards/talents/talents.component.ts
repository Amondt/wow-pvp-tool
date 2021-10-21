import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { BlizzardApiService } from "src/app/services/blizzard-api.service";

@Component({
    selector: "app-talents",
    templateUrl: "./talents.component.html",
    styleUrls: ["./talents.component.css"],
})
export class TalentsComponent implements OnInit, OnDestroy {
    charDetails: any;
    charDetailsSubscription: Subscription;

    step = 0;
    talentsLearningLevels = [15, 25, 30, 35, 40, 45, 50];

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

    setStep(index: number) {
        this.step = index;
    }

    toggleTalentDetails = (
        talentIndex: number,
        type: string,
        specializationIndex: number
    ) => {
        const pveTalentsList =
            this.charDetails.specializations.specializations[
                specializationIndex
            ].talents;
        const pvpTalentsList =
            this.charDetails.specializations.specializations[
                specializationIndex
            ].pvp_talent_slots;

        if (type === "pve") {
            pveTalentsList[talentIndex].isOverlayOpen =
                !pveTalentsList[talentIndex].isOverlayOpen;
        } else if (type === "pvp") {
            pvpTalentsList[talentIndex].selected.isOverlayOpen =
                !pvpTalentsList[talentIndex].selected.isOverlayOpen;
        }
    };

    ngOnDestroy() {
        this.charDetailsSubscription.unsubscribe();
    }
}
