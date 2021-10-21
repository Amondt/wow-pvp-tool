import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { BlizzardApiService } from '../services/blizzard-api.service';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-server-list',
  templateUrl: './server-list.component.html',
  styleUrls: ['./server-list.component.css'],
})
export class ServerListComponent implements OnInit, OnDestroy, AfterViewInit {
  // dataSource = new MatTableDataSource();
  serverListSubscription: Subscription;
  displayedColumns: string[] = [
    'status',
    'name',
    'population',
    'timezone',
    'language',
  ];

  isFetchingData;
  isFetchingDataSubscription: Subscription;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private blizzardApiService: BlizzardApiService) {}

  ngOnInit() {
    // this.isFetchingData = this.blizzardApiService.isFetchingServers;
    // this.dataSource.data = this.blizzardApiService.serverList;
    // this.dataSource.paginator = this.paginator;
    // this.serverListSubscription =
    //   this.blizzardApiService.serverListSubject.subscribe(
    //     (serverList: any[]) => {
    //       this.dataSource.data = serverList;
    //     }
    //   );
    // this.isFetchingDataSubscription =
    //   this.blizzardApiService.isFetchingServersSubject.subscribe(
    //     (isFetchingServers) => {
    //       this.isFetchingData = isFetchingServers;
    //     }
    //   );
  }

  ngAfterViewInit(): void {}

  // onFilter = (filterValue: string) =>
  //   (this.dataSource.filter = filterValue.trim().toLowerCase());

  ngOnDestroy(): void {
    this.serverListSubscription.unsubscribe();
    this.isFetchingDataSubscription.unsubscribe();
  }
}
