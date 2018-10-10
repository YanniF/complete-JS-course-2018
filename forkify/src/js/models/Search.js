import axios from 'axios';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    const key = '59134cf2a8a0da805045200ddc195433';
  
    try {
      const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.result = res.data.recipes;
      // console.log(this.result)
    }
    catch(e) {
      alert(e);
    }  
  }
}


