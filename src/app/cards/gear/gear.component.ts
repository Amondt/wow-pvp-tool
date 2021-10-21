import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { BlizzardApiService } from "src/app/services/blizzard-api.service";

@Component({
    selector: "app-gear",
    templateUrl: "./gear.component.html",
    styleUrls: ["./gear.component.scss"],
})
export class GearComponent implements OnInit, OnDestroy {
    charDetails: any;
    charDetailsSubscription: Subscription;

    equipmentSlotsArray = [
        { type: "HEAD", emptySlotBackgroundPosition: 0 },
        { type: "HANDS", emptySlotBackgroundPosition: -406 },
        { type: "NECK", emptySlotBackgroundPosition: -59 },
        { type: "WAIST", emptySlotBackgroundPosition: -464 },
        { type: "SHOULDER", emptySlotBackgroundPosition: -117 },
        { type: "LEGS", emptySlotBackgroundPosition: -522 },
        { type: "BACK", emptySlotBackgroundPosition: -175 },
        { type: "FEET", emptySlotBackgroundPosition: -579 },
        { type: "CHEST", emptySlotBackgroundPosition: -175 },
        { type: "FINGER_1", emptySlotBackgroundPosition: -638 },
        { type: "SHIRT", emptySlotBackgroundPosition: -289 },
        { type: "FINGER_2", emptySlotBackgroundPosition: -638 },
        { type: "TABARD", emptySlotBackgroundPosition: -232 },
        { type: "TRINKET_1", emptySlotBackgroundPosition: -695 },
        { type: "WRIST", emptySlotBackgroundPosition: -348 },
        { type: "TRINKET_2", emptySlotBackgroundPosition: -695 },
        { type: "MAIN_HAND", emptySlotBackgroundPosition: -754 },
        { type: "OFF_HAND", emptySlotBackgroundPosition: -812 },
    ];

    equippedItemsArray = [];

    isItemDetailsOpen = false;

    constructor(private blizzardApiService: BlizzardApiService) {}

    ngOnInit() {
        this.charDetails = this.blizzardApiService.charDetails;
        this.populateEquippedItemArray();

        this.charDetailsSubscription =
            this.blizzardApiService.charDetailsSubject.subscribe(
                (charDetails) => {
                    this.charDetails = charDetails;
                    this.populateEquippedItemArray();
                }
            );
    }

    populateEquippedItemArray = () => {
        if (this.charDetails) {
            this.equippedItemsArray = [];
            this.equipmentSlotsArray.forEach((slotItem) => {
                let sortedItem =
                    this.charDetails.equipment.equipped_items.filter(
                        (equippedItem) => {
                            return equippedItem.slot.type === slotItem.type;
                        }
                    );
                this.equippedItemsArray.push({
                    ...sortedItem[0],
                    emptySlotBackgroundPosition:
                        slotItem.emptySlotBackgroundPosition,
                });
            });
        }
    };

    toggleItemDetails = (index: number) => {
        this.equippedItemsArray[index].isOverlayOpen =
            !this.equippedItemsArray[index].isOverlayOpen;
    };

    getItemColor = (quality: string) => {
        switch (quality) {
            case "EPIC":
                return "#b735dc";
            case "RARE":
                return "#0079f0";
            case "LEGENDARY":
                return "#fc7e00";
            case "UNCOMMON":
                return "#1df800";
            default:
                return "#ffffff";
        }
    };

    getStatColor = (color: any) =>
        `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;

    ngOnDestroy() {
        this.charDetailsSubscription.unsubscribe();
    }
}
