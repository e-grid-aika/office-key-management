/**
 * setTrigger
 * 指定時間に関数を実行するトリガー
 * @param {string} [funcName=''] トリガー実行したい関数名
 * @param {number} [hour=8]  トリガー実行したい時間(デフォルトは8時)
 * @param {number} [minutes=59] トリガー実行したい分(デフォルトは59分)
 */

export function setTrigger(funcName: string = '',hour: number = 8, minutes: number = 59){
  //Dateオブジェクトで実行した時間を取得
  let time: Date = new Date();
  //setHours,setMinutesで関数funcNameを実行する時間を設定
  time.setHours(hour);
  time.setMinutes(minutes);
  ScriptApp.newTrigger(funcName).timeBased().at(time).create();
}
