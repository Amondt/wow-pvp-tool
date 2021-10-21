import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BlizzardApiService } from 'src/app/services/blizzard-api.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit, OnDestroy {
  charDetails: any;
  charDetailsSubscription: Subscription;

  displayedStatistics: SingleStatistic[];

  stats = [
    { name: 'agility', color: '#ffd955' },
    { name: 'intellect', color: '#d26cd1' },
    { name: 'strength', color: '#f33232' },
    { name: 'mastery', color: '#9256ff' },
    { name: 'critical-strike', color: '#e01c1c' },
    { name: 'haste', color: '#0ed59b' },
    { name: 'versatility', color: '#bfbfbf' },
    { name: 'stamina', color: '#ff8b2d' },
    { name: 'health', color: '#27cc4e' },
    { name: 'mana', color: '#1c8aff' },
    { name: 'energy', color: '#cb9501' },
    { name: 'rage', color: '#ab0000' },
    { name: 'focus', color: '#d45719' },
    { name: 'maelstrom', color: '#008fff' },
    { name: 'insanity', color: '#6600ff' },
    { name: 'runic-power', color: '#00bcde' },
    { name: 'fury', color: '#8400ff' },
    { name: 'pain', color: '#d45719' },
  ];

  mainStat;

  constructor(private blizzardApiService: BlizzardApiService) {}

  ngOnInit() {
    this.charDetailsSubscription =
      this.blizzardApiService.charDetailsSubject.subscribe((charDetails) => {
        this.charDetails = charDetails;
      });
    this.charDetails = this.blizzardApiService.charDetails;

    this.mainStat = this.getMainStat(
      {
        ...this.charDetails.statistics.agility,
        name: 'agility',
      },
      {
        ...this.charDetails.statistics.intellect,
        name: 'intellect',
      },
      {
        ...this.charDetails.statistics.strength,
        name: 'strength',
      }
    );

    this.displayedStatistics = [
      {
        name: this.mainStat.name,
        rawAmount: this.mainStat.effective,
        color: this.getStatColor(this.mainStat.name),
        isOverlayOpen: false,
      },
      {
        name: 'mastery',
        rawAmount: this.charDetails.statistics.mastery.rating,
        color: this.getStatColor('mastery'),
        percentage: this.charDetails.statistics.mastery.value,
        isOverlayOpen: false,
      },
      {
        name: 'versatility',
        rawAmount: this.charDetails.statistics.versatility,
        color: this.getStatColor('versatility'),
        percentage: this.charDetails.statistics.versatility_damage_done_bonus,
        isOverlayOpen: false,
      },
      {
        name: 'stamina',
        rawAmount: this.charDetails.statistics.stamina.effective,
        color: this.getStatColor('stamina'),
        isOverlayOpen: false,
      },
      {
        name: this.charDetails.statistics.power_type.name
          .toLowerCase()
          .replace(' ', '-'),
        rawAmount: this.charDetails.statistics.power,
        color: this.getStatColor(
          this.charDetails.statistics.power_type.name
            .toLowerCase()
            .replace(' ', '-')
        ),
        isOverlayOpen: false,
      },
      {
        name: 'critical-strike',
        rawAmount: this.charDetails.statistics.spell_crit.rating,
        color: this.getStatColor('critical-strike'),
        percentage: this.charDetails.statistics.spell_crit.value,
        isOverlayOpen: false,
      },
      {
        name: 'haste',
        rawAmount: this.charDetails.statistics.spell_haste.rating,
        color: this.getStatColor('haste'),
        percentage: this.charDetails.statistics.spell_haste.value,
        isOverlayOpen: false,
      },
      {
        name: 'health',
        rawAmount: this.charDetails.statistics.health,
        color: this.getStatColor('health'),
        isOverlayOpen: false,
      },
    ];
  }

  getMainStat = (...stats) => {
    let mainStat = stats[0];
    stats.forEach((stat) => {
      if (stat.effective > mainStat.effective) {
        mainStat = stat;
      }
    });
    return mainStat;
  };

  getStatColor = (stat: string) => {
    for (const singleStat of this.stats) {
      if (singleStat.name === stat) {
        return singleStat.color;
      }
    }
  };

  toggleStatisticOverlay = (index: number) => {
    this.displayedStatistics[index].isOverlayOpen =
      !this.displayedStatistics[index].isOverlayOpen;
  };

  ngOnDestroy() {
    this.charDetailsSubscription.unsubscribe();
  }
}

interface SingleStatistic {
  name: string;
  rawAmount: number;
  color: string;
  isOverlayOpen: boolean;
  percentage?: number;
}
