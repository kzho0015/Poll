import { Component } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import * as io from "socket.io-client";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  socket: SocketIOClient.Socket;
  pollObj = {
    question:"",
    options:[]
  };
  vote: number;

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];


  constructor() {
    this.socket = io.connect();
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit() {
    this.newClient();
    this.updateVote();
  }

  //listen the new connetion 
  newClient(){
    this.socket.on("display", data=>{
      this.displayChart(data);
      this.displayLabel(data);
      this.pollObj = data;
    });  
  }

  displayLabel(data){
    var arr = [];
    for(var i in data.options){
      arr.push(data.options[i].text)
    }
    this.pieChartLabels = arr;
  }

  displayChart(data){
    var arr = [];
    for(var i in data.options){
      arr.push(data.options[i].count); 
    }
    this.pieChartData = arr;
  }

  clientVote(){
      this.socket.emit("newVote", {vote:this.vote})
  }

  updateVote(){
    this.socket.on("vote", data=>{
      this.displayChart(data);
    });
  }

}