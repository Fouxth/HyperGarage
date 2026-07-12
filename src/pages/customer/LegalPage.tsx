import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, FileText, Cookie, Award, ArrowLeft } from 'lucide-react';

type LegalType = 'privacy' | 'terms' | 'cookies' | 'warranty';

export default function LegalPage() {
  const { type } = useParams<{ type: LegalType }>();
  const { t } = useTranslation();

  const currentType = (type || 'privacy') as LegalType;

  const contentMap = {
    privacy: {
      title: t('footer.privacy'),
      icon: Shield,
      th: [
        'นโยบายความเป็นส่วนตัวนี้ชี้แจงถึงวิธีการที่ HyperGarage เก็บรวบรวม ใช้ และป้องกันข้อมูลส่วนบุคคลของท่านเมื่อเข้าใช้งานเว็บไซต์ของเรา',
        'ข้อมูลที่เราจัดเก็บประกอบด้วย ชื่อ-นามสกุล เบอร์โทรศัพท์ และที่อยู่สำหรับจัดส่ง ซึ่งได้มาจากการกรอกข้อมูลสั่งซื้อในขั้นตอน Guest Checkout เท่านั้น',
        'เราใช้ข้อมูลเหล่านี้เพื่อวัตถุประสงค์ในการประมวลผลคำสั่งซื้อ การจัดส่งสินค้า และการติดตามสถานะออเดอร์ของท่าน',
        'HyperGarage ขอรับรองว่าจะรักษาข้อมูลส่วนบุคคลของท่านเป็นความลับอย่างปลอดภัยสูงสุด และจะไม่มีการขาย เผยแพร่ หรือแบ่งปันข้อมูลให้กับบุคคลภายนอก เว้นแต่บริษัทขนส่งเพื่อการส่งมอบสินค้าเท่านั้น',
      ],
      en: [
        'This privacy policy describes how HyperGarage collects, uses, and protects your personal information when you use our website.',
        'The information we collect includes your name, phone number, and shipping address, which are collected solely during the Guest Checkout process.',
        'We use this information for the purpose of processing your orders, delivering products, and tracking your order status.',
        'HyperGarage guarantees that your personal data will be kept secure, and we will not sell, distribute, or lease your personal information to third parties except for shipping providers.',
      ],
    },
    terms: {
      title: t('footer.terms'),
      icon: FileText,
      th: [
        'ยินดีต้อนรับสู่เว็บไซต์ HyperGarage กรุณาอ่านเงื่อนไขการใช้บริการเหล่านี้โดยละเอียดก่อนทำรายการซื้อสินค้า',
        'การเข้าใช้งานและการทำรายการสั่งซื้อสินค้าบนเว็บไซต์นี้ ถือว่าท่านตกลงยอมรับข้อกำหนดและเงื่อนไขการให้บริการเหล่านี้ทุกประการ',
        'รายละเอียดสินค้า ราคา และข้อมูลความเข้ากันได้ของอะไหล่รถยนต์อาจมีการเปลี่ยนแปลงตามความเหมาะสม เราพยายามอัปเดตข้อมูลให้ถูกต้องที่สุดเสมอ',
        'ในกรณีสั่งซื้อสำเร็จ ระบบจะทำการล็อกสต็อกสินค้าให้ท่านทันที โดยท่านตกลงที่จะชำระเงินตามช่องทางที่เลือก (เช่น COD ปลายทาง หรือการโอนเงิน) อย่างซื่อสัตย์',
      ],
      en: [
        'Welcome to HyperGarage. Please read these terms of service carefully before placing any orders.',
        'By accessing the website and purchasing products, you agree to be bound by these terms and conditions of service.',
        'Product details, prices, and compatibility information are subject to change. We always strive to keep our catalog as accurate as possible.',
        'Once an order is successfully placed, the stock is reserved for you. You agree to make the payment honestly via your chosen method.',
      ],
    },
    cookies: {
      title: t('footer.cookies'),
      icon: Cookie,
      th: [
        'เว็บไซต์ HyperGarage ใช้คุกกี้ (Cookies) เพื่อส่งมอบประสบการณ์การใช้งานที่ดีที่สุดและมีความปลอดภัยสูงสุดให้แก่ท่าน',
        'คุกกี้ที่เราใช้งานส่วนใหญ่เป็นคุกกี้เพื่อการทำงานของระบบ (Functional Cookies) เช่น การจดจำสินค้าในตะกร้า (Cart) และการเก็บรายการสินค้าที่ถูกใจ (Wishlist)',
        'ข้อมูลจากคุกกี้จะถูกเก็บบันทึกอยู่ภายในเครื่องคอมพิวเตอร์หรืออุปกรณ์พกพาของท่าน (ผ่านเบราว์เซอร์) โดยระบบของพวกเราจะไม่มีการจัดเก็บข้อมูลส่วนตัวที่อ่อนไหวใดๆ ไว้',
        'ท่านสามารถเลือกที่จะยอมรับหรือปฏิเสธคุกกี้ได้โดยการปรับแต่งการตั้งค่าเบราว์เซอร์ของท่าน แต่อาจส่งผลให้ไม่สามารถใช้งานบางฟังก์ชันได้ (เช่น ตะกร้าสินค้าหายไปเมื่อปิดเว็บ)',
      ],
      en: [
        'HyperGarage uses cookies to deliver the best and most secure browsing experience for you.',
        'The cookies we use are mainly functional cookies, such as remembering items in your Cart and storing your Wishlist preferences.',
        'Cookie data is stored locally on your device (via your browser), and our servers do not log any sensitive personal identifier via cookies.',
        'You can choose to accept or decline cookies by modifying your browser settings, though it might prevent certain features from functioning.',
      ],
    },
    warranty: {
      title: t('footer.warranty'),
      icon: Award,
      th: [
        'HyperGarage ขอรับประกันว่าสินค้าทุกชิ้นที่จำหน่ายจากเราเป็นของแท้ 100% และผ่านการตรวจสอบคุณภาพก่อนจัดส่ง',
        'เรารับประกันความพึงพอใจและยินดีคืนเงิน/เปลี่ยนสินค้าใหม่ภายใน 7 วันทำการ นับจากวันที่ท่านได้รับสินค้า หากพบว่าสินค้าเสียหายจากการผลิตหรือส่งสินค้าผิดรุ่น',
        'กรณีซื้ออะไหล่ไปแล้วใช้ไม่ได้เนื่องจากระบบ Compatibility Checker บอกข้อมูลผิดพลาด ทางเรายินดีรับคืนสินค้าและคืนเงินเต็มจำนวน (สินค้าต้องอยู่ในสภาพเดิม)',
        'การรับประกันจะไม่ครอบคลุมกรณีที่ความเสียหายเกิดจากการติดตั้งที่ผิดวิธี การใช้งานผิดประเภท หรืออุบัติเหตุหลังจากที่ส่งมอบสินค้าไปแล้ว',
      ],
      en: [
        'HyperGarage guarantees that all products sold on our platform are 100% authentic and quality checked before shipment.',
        'We offer a 7-day satisfaction warranty. We will issue a refund or exchange if the product is defective due to manufacturing or incorrect shipping.',
        'If the purchased part does not fit due to our Compatibility Checker error, we gladly accept returns and issue a full refund (product must be in original condition).',
        'This warranty does not cover damages caused by incorrect installation, misuse, or accidents occurred after delivery.',
      ],
    },
  };

  const activeContent = contentMap[currentType] || contentMap.privacy;
  const ActiveIcon = activeContent.icon;

  const tabs: { key: LegalType; label: string; icon: typeof Shield }[] = [
    { key: 'privacy', label: t('footer.privacy'), icon: Shield },
    { key: 'terms', label: t('footer.terms'), icon: FileText },
    { key: 'cookies', label: t('footer.cookies'), icon: Cookie },
    { key: 'warranty', label: t('footer.warranty'), icon: Award },
  ];

  return (
    <div className="min-h-screen bg-bg py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>{t('order.backHome')}</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-4 sticky top-24">
              <h2 className="text-xs font-semibold text-muted uppercase tracking-wider px-3 mb-4">
                {t('footer.legal')}
              </h2>
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const TabIcon = tab.icon;
                  const isActive = currentType === tab.key;
                  return (
                    <Link
                      key={tab.key}
                      to={`/legal/${tab.key}`}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <TabIcon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 border-b border-border pb-6 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ActiveIcon className="w-5 h-5" />
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  {activeContent.title}
                </h1>
              </div>

              {/* TH Section */}
              <div className="space-y-4 mb-8">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1 rounded">
                  ภาษาไทย
                </span>
                {activeContent.th.map((p, i) => (
                  <p key={i} className="text-sm md:text-base text-muted leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>

              <div className="border-t border-border/50 my-6" />

              {/* EN Section */}
              <div className="space-y-4">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider bg-white/5 px-2 py-1 rounded">
                  English
                </span>
                {activeContent.en.map((p, i) => (
                  <p key={i} className="text-sm md:text-base text-muted leading-relaxed italic opacity-85">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
