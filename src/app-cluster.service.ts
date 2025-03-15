import cluster, { Cluster } from 'node:cluster';
import os from 'os';
import { Injectable } from '@nestjs/common';

const numCPUs = os.cpus().length - 1;

@Injectable()
export class AppClusterService {
  static clusterize(callback: Function): void {
    // console.log('process', process.env);
    callback();
    return;
    const AppCluster = cluster as Cluster;

    if (AppCluster.isPrimary) {
      console.log(`Master server started on ${process.pid}`);
      for (let i = 0; i < numCPUs; i++) {
        AppCluster.fork();
      }
      AppCluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting`);
        AppCluster.fork();
      });
    } else {
      console.log(`Cluster server started on ${process.pid}`);
      callback();
    }
  }
}
