import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

import kjua from "kjua";
import jsPDF from 'jspdf';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  
  /** infos */
  fullname = '';
  address = '';
  phone = '';
  email = '';
  fullString = '';

  /** QR */
  numbers = [];
  progressVal = 0;
  progressMax = 28;
  numcodes = 28;
  startTime = 0;
  timeSingleCode = 0;

  /** PDF */
  columnsPerPage = 4;
  rowsPerPage = 7;
  pageWidth = 210;
  pageHeight = 297;
  cellWidth = 36;
  cellHeight = 36;
  borderTopBottom = ((this.pageHeight - (this.rowsPerPage * this.cellHeight)) / 2);

  /** Navbar */
  isNavActive = false;

  @ViewChild("imgBuffer")
  imageElement: ElementRef;

  constructor(private translateService: TranslateService){


    this.numbers = Array(28).fill([]).map((x, i) => i);
    this.translateService.setTranslation('en', 
    {
      "TITLE": "Keep Your Things Safe!",
      "PHRASE1": "Is losing your cell phone, wallet, or keys part of your daily routine?",
      "PHRASE2": "You want to get your lost items back?",
      "NAME": "🙍 Full Name",
      "PHONE": "📱 Phone Number",
      "ADDRESS": "🗺️ Address, City (Optional)",
      "EMAIL": "📧 Email (Optional)",
      "PLACEHOLDER_NAME": "Your Full Name Here...",
      "PLACEHOLDER_PHONE": "Example : +(216) 20018628...",
      "PLACEHOLDER_ADDRESS": "Example : Bizerte, Tunisia",
      "PLACEHOLDER_EMAIL": "Your Email address Here...",
      "HINT1":"Step 1 : Enter your information",
      "HINT2": "Step 2 : Download your QR Stickers 👇",
      "HINT3": "Step 3 : Print your PDF file and cut your stickers ✂️",
      "BUTTON_TXT" : "Download PDF",
      "QR_HINT": "QR Preview - Use Your Phone 📱",
      "CONTACT": "Contact Us",
      "CREATED_BY": "Created By ",
      "DESC" : "You can easily find your lost item with us. Protect your property against loss. You can attach your QR to anything you don’t want to lose: keys, wallets, bags, Laptops.. or even animals",
      "IDEA": "The idea of this website"
    });
    
    this.translateService.setTranslation('ar', 
    {
      "TITLE": "!استحفظ على ممتلكاتك",
      "PHRASE1": "ديما تنسى و إلا تضيع دبشك ؟",
      "PHRASE2": "تحب طريقة تنجم تضمن بيها استرجاع ممتلكاتك ؟",
      "NAME": "الإسم و اللقب 🙍",
      "PHONE": "رقم الهاتف 📱",
      "ADDRESS": "(العنوان (اختياري 🗺️",
      "EMAIL": "(البريد الإلكتروني (اختياري 📧",
      "PLACEHOLDER_NAME": "اسمك و لقبك",
      "PLACEHOLDER_PHONE": "+(216) 20018628 :مثال ",
      "PLACEHOLDER_ADDRESS": "مثال : بنزرت، تونس",
      "PLACEHOLDER_EMAIL": "عنوانك الإلكتروني",
      "HINT1":"المرحلة 1 : قم بكتابة معلوماتك",
      "HINT2": "👇 المرحلة 2 : قم بتحميل الملف من هنا",
      "HINT3": " المرحلة 3 : قم بطباعة الملف و قصّ القصاصات ✂️",
      "BUTTON_TXT" : "PDF تحميل ملف",
      "QR_HINT": "📱 معاينة الكود - استعمل هاتفك",
      "CONTACT": "تواصل معنا",
      "CREATED_BY": "تمت برمجة الموقع من طرف",
      "DESC" : "برشا ناس ديما تضيع ممتلكاتها، ما فما حتى حل الا انك تلوج في صفحات الفيسبوك عليها ... علاش ما تستعملش طريقة ساهلة و مجانية باش تضمن رجوع ممتلكاتك اذا لقاها شخص ضائعة",
      "IDEA" : "فكرة الموقع"
    });
  
}

ngOnInit() {
  this.translateService.use('ar');
}


 isRTL(){
  if (this.translateService.currentLang === 'ar'){
    return "has-text-right rlt-direction";
  } 
  else {
    return "has-text-left ";
  }
 }




  changeLang(lang: string){
    this.translateService.use(lang)
  }

  
  static getBarcodeData(text: string, size = 400, image) {
    return kjua({
      render: "canvas",
      crisp: true,
      minVersion: 1,
      ecLevel: "H",
      size: size,
      ratio: undefined,
      fill: "#333",
      back: "#fff",
      text,
      rounded:0,
      quiet: 1,
      mode: "image",
      mSize: 45,
      mPosX: 50,
      mPosY: 50,
      label: "Scan Me!",
      fontname: "Hind Madurai", // from Google fonts
      fontcolor: "red",
      image
    });
  }

toggleNav(){
  this.isNavActive = !this.isNavActive;
}

Checknav(){
  if (this.isNavActive)
    return "is-active";
  else
    return ""; 
}
  
  reset(){
    this.fullname = '';
    this.email = '';
    this.address = '';
    this.phone = '';
    this.fullString = '';
  }


 checkEmpty() {
   if (this.fullname === '' && this.phone === '' && this.email === '' && this.address === '' )
      return true;
   else
     return false;
 }


 isDisabled(){
   if (this.fullname === '' || this.phone === '')
    return true;
  else 
    return undefined;
 }


 isblured(){
  if (this.fullname === '' || this.phone === '')
    return 'shadow';
  else 
    return '';
 }


  updatefullstring() {
    this.fullString = this.fullname + '\n' + this.address + '\n' + this.phone + '\n' + this.email;

    // if (this.address === '')
    //   this.fullString = this.fullname + '\n' + this.phone + '\n' + this.email;

    // if (this.email === '')
    //   this.fullString = this.fullname + '\n' + this.phone + '\n';
  }

  generateNumbers(): void {
    this.numbers = Array(this.numcodes).fill([]).map((x, i) => i);
    this.progressMax = this.numcodes;
  }


  generatePDF(index = 0, document = new jsPDF(), colPos = 0, rowPos = 0) {

    if (this.fullname === '') return;
    if (this.phone === '') return;


    if (index === 0) {
      this.startTime = new Date().getTime();
    }
    this.timeSingleCode = (new Date().getTime() - this.startTime) / index;
    this.progressVal = index + 1;

    this.fullString = this.fullname + '\n' + this.address + '\n' + this.phone + '\n' + this.email;

    if (this.address === '')
      this.fullString = this.fullname + '\n' + this.phone + '\n' + this.email;

    if (this.email === '')
      this.fullString = this.fullname + '\n' + this.phone + '\n';

    const barcodeData = AppComponent.getBarcodeData(this.fullString, 400, this.imageElement.nativeElement);
    const x = ((this.pageWidth / this.columnsPerPage) / 2) - (this.cellWidth / 2) + (colPos * (this.pageWidth / this.columnsPerPage));
    const y = this.borderTopBottom + (rowPos * this.cellHeight) + 1;
    document.addImage(barcodeData, "JPG", x, y, this.cellWidth - 2, this.cellHeight - 2);
    colPos++;
    if (colPos >= this.columnsPerPage) {
      colPos = 0;
      rowPos++;
    }
    if (rowPos >= this.rowsPerPage && index < this.progressMax - 1) {
      rowPos = 0;
      colPos = 0;
      document.addPage();
    }

    if (index === this.progressMax - 1) {
      // FOOTER
      let strEN = "QR Created By FoundIT - Visit : https://foundit.website";
      let strAR = "Adem Kouki - 2019";
      document.setTextColor(100);
      document.setFontSize(10);
      document.text(strEN, 210 / 2, 297  - 10, 'center');
      document.text(strAR, 210 / 2, 297  - 5, 'center');
      document.save(`QR-Codes.pdf`);
      

    } else {
      requestAnimationFrame(() => this.generatePDF(index + 1, document, colPos, rowPos));
    }
  }



  

}
