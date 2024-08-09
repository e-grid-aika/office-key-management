import { setTrigger } from "./common";
import { Chatwork } from "./chatwork";

const STATUS_CHECKOUT = "貸出中";
const STATUS_RETURN = "返却済";


export function main(){
	let check_day: Date = new Date();
	// 土日はトリガーのセットを行わない
	if(check_day.getDay() != 0 && check_day.getDay() != 6){
		setTrigger('checkKeyUnreturned',9,0);
	}
}

/**
 * onEditCustom()
 * バインドされたスプレッドシートのセルの値が変更されると実行される関数
 */
export function onEditCustom(e){
	const sheet = e.source.getActiveSheet();
	const range = e.range;

	const token = PropertiesService.getScriptProperties().getProperty("Chatwork_API_Token");
	const roomId = PropertiesService.getScriptProperties().getProperty("Chatwork_room_id");
	let chatwork = new Chatwork(token,roomId);
	
	// B列目またはC列目のセルに値が入力されたまたは、値が編集された場合
	if(range.getColumn() == 2 || range.getColumn() == 3){
		const memberName = sheet.getRange("A".concat('',range.getRow())).getValue();
		const status = sheet.getRange("D".concat('',range.getRow())).getValue();

		if(status == STATUS_CHECKOUT){
			let message =  `[info][title]🔑鍵の貸し出し連絡🔑[/title]${memberName}さんが共用キーを持ち出されました。\
											\n持ち出した鍵は次の出勤日に返却してください。[/info]`;
			chatwork.sendMessage(message);
		}else if(status == STATUS_RETURN){
			let message =  `[info][title]🔑鍵の貸し出し連絡🔑[/title]共用キーが返却されました。[/info]`;
			chatwork.sendMessage(message);
		}
	} 
}

/**
 * checkKeyUnreturned()
 * スプレッドシートから未返却の鍵がないか確認する関数
 * 未返却の鍵がある場合はChatworkにメッセージを送信
 */
export function checkKeyUnreturned(): boolean{ 
  const token = PropertiesService.getScriptProperties().getProperty("Chatwork_API_Token");
	const roomId = PropertiesService.getScriptProperties().getProperty("Chatwork_room_id");
	let chatwork = new Chatwork(token,roomId);
	const sheet = SpreadsheetApp.getActiveSheet();
	const lastRow = sheet.getRange(sheet.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
    
  for (var i = 5; i <= lastRow; i++){
    const returnDate = sheet.getRange("C".concat('',i)).getValue();
    const check_status = sheet.getRange("D".concat('',i)).getValue();
    if(check_status == STATUS_CHECKOUT && returnDate == ''){
      let message =  `[info][title]🔑鍵の貸し出し連絡🔑[/title]共用キーが返却されていません。\
                      \n共用キーをお持ちの方はすぐに返却してください。[/info]`;
      chatwork.sendMessage(message);
      return false;
    }
  }
  return true;
}

declare let global: any;
(global as any).onEditCustom = onEditCustom;
(global as any).main = main;
(global as any).checkKeyUnreturned = checkKeyUnreturned;
(global as any).setTrigger = setTrigger;
(global as any).Chatwork = Chatwork;
  