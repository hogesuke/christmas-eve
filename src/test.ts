class Hoge {
  private message: string;

  constructor(message: string) {
    this.message = message;
  }

  hello() {
    return 'Hello!' + this.message;
  }
}

const hoge = new Hoge('へいへいへい！');
console.log(hoge.hello());

