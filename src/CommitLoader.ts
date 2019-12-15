import axios from 'axios';
import Commit from './Commit';

export default class CommitLoader {
  private apiRoot: string;

  constructor (apiRoot: string) {
    this.apiRoot = apiRoot;
  }

  async load (target: string): Promise<Commit[]> {
    return axios.get(this.apiRoot + '/commits', {
      params: { target }
    }).then(res => {
      return res.data.map((message: string) => new Commit(message));
    });
  }
}