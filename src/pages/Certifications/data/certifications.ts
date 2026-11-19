import type { CertificationData } from '../../../types'

export type CertificationCategory =
  | 'IPA・情報処理'
  | 'オフィス・事務・会計'
  | 'プログラミング'
  | 'AI・データサイエンス'
  | 'その他'

export const certificationCategories: CertificationCategory[] = [
  'IPA・情報処理',
  'オフィス・事務・会計',
  'プログラミング',
  'AI・データサイエンス',
  'その他',
]

export const CERTIFICATIONS_UPDATED_AT = '2026-11-19'

export const initialCertifications: CertificationData[] = [
  {
    id: 'cert-itpass',
    title: 'ITパスポート試験（iパス）',
    category: 'IPA・情報処理',
    level: '入門・全職種向け',
    examInfo: 'CBT方式（通年・随時受験） / 120分',
    fee: '7,500円（税込）',
    description:
      '経済産業省認定の国家試験。AIやDX、セキュリティ、経営戦略、会計・法務など、ITを利活用するすべての社会人に必要な基礎知識を証明します。',
    advice:
      'まずは「ITパスポート過去問道場」を隙間時間に繰り返し解くのが王道です。用語が難しいと感じたら、AIプロンプト辞典を活用して「中学生でも分かるように例えて」とAIに解説させると理解が一気に進みます！',
    officialUrl: 'https://www3.jitec.ipa.go.jp/JitesCbt/index.html',
    applyUrl: 'https://www3.jitec.ipa.go.jp/JitesCbt/html/application/applies.html',
    studyLinks: [
      {
        label: 'ITパスポート過去問道場（無料演習）',
        url: 'https://www.itpassportsiken.com/ipkakomon.php',
      },
      {
        label: 'IPA公式 過去問題・解答例',
        url: 'https://www3.jitec.ipa.go.jp/JitesCbt/html/openinfo/questions.html',
      },
    ],
  },
  {
    id: 'cert-sg',
    title: '情報セキュリティマネジメント試験（SG）',
    category: 'IPA・情報処理',
    level: '基本・全ビジネスパーソン向け',
    examInfo: 'CBT方式（通年・随時受験） / 120分',
    fee: '7,500円（税込）',
    description:
      '情報セキュリティの脅威や対策、関連法規、情報資産管理など、組織内で情報を安全に運用・管理するための実践的な基礎知識を認定する国家試験です。',
    advice:
      'ITパスポートの次のステップや、事務・バックオフィス職志望の方にも非常におすすめです。科目Aは過去問道場で知識を固め、科目BはIPA公式のサンプル問題で「事例読解のパターン」に慣れておくのが合格の近道です。',
    officialUrl: 'https://www.ipa.go.jp/shiken/kubun/sg.html',
    applyUrl: 'https://cbt-s.com/examinee/examination/sg',
    studyLinks: [
      {
        label: '情報セキュリティマネジメント過去問道場',
        url: 'https://www.sg-siken.com/sgkakomon.php',
      },
      {
        label: 'IPA公式 過去問題・サンプル問題',
        url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html',
      },
    ],
  },
  {
    id: 'cert-fe',
    title: '基本情報技術者試験（FE）',
    category: 'IPA・情報処理',
    level: '基本・ITエンジニア登竜門',
    examInfo: 'CBT方式（通年・随時受験） / 科目A 90分・科目B 100分',
    fee: '7,500円（税込）',
    description:
      'ITエンジニアとしての基礎知識（ネットワーク、DB、セキュリティ、アルゴリズム、疑似言語プログラミング）を体系的に証明する定番の国家資格です。',
    advice:
      'エンジニア職を目指す方の就職活動で強いアピール材料になります。科目Aは過去問道場で頻出問題を固めつつ、科目B（アルゴリズム・セキュリティ）はトレース（変数の値を手で追う練習）を毎日少しずつ続けることが重要です。',
    officialUrl: 'https://www.ipa.go.jp/shiken/kubun/fe.html',
    applyUrl: 'https://cbt-s.com/examinee/examination/fe',
    studyLinks: [
      {
        label: '基本情報技術者試験 過去問道場',
        url: 'https://www.fe-siken.com/fekakomon.php',
      },
      {
        label: 'IPA公式 過去問題・科目Bサンプル問題',
        url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html',
      },
    ],
  },
  {
    id: 'cert-boki',
    title: '日商簿記検定（3級・2級）',
    category: 'オフィス・事務・会計',
    level: '事務・経理・IT全職種',
    examInfo: 'ネット試験（CBT随時） / 統一試験（年3回）',
    fee: '3級 3,300円 / 2級 5,500円（税込・ネット試験は別途事務手数料550円）',
    description:
      '企業の財務状況やお金の流れ（仕訳・貸借対照表・損益計算書）を読み解くスキルを証明。一般事務・経理だけでなく、IT系業務アプリ開発やビジネス理解にも直結します。',
    advice:
      '「CPAラーニング」の無料動画講義＋無料模擬試験が圧倒的に分かりやすくおすすめです。まずは3級で仕訳のルールを身につけ、ITパスポートのストラテジ系（財務計算）と合わせて学ぶと相乗効果があります。',
    officialUrl: 'https://www.kentei.ne.jp/boki',
    applyUrl: 'https://www.kentei.ne.jp/examination_method',
    studyLinks: [
      {
        label: 'CPAラーニング（完全無料・簿記講義＆模試）',
        url: 'https://www.cpa-learning.com/',
      },
      {
        label: '日本商工会議所 簿記サンプル問題',
        url: 'https://www.kentei.ne.jp/bookkeeping/sample',
      },
    ],
  },
  {
    id: 'cert-mos',
    title: 'MOS（Microsoft Office Specialist）',
    category: 'オフィス・事務・会計',
    level: '実務基礎・Office操作証明',
    examInfo: '随時試験（テストセンター） / 全国一斉試験',
    fee: '一般 12,980円（税込・一般/上級共通・学割9,680円）',
    description:
      'Word、Excel、PowerPointなどのMicrosoft Office製品の実務操作スキルを客観的に証明する国際資格。パソコン操作の証明として履歴書で広く評価されます。',
    advice:
      'まずは需要が最も高い「Excel（一般レベル）」から取得するのがおすすめです。実技試験のため操作の正確さとスピードが求められます。模擬試験プログラム付きの公式対策テキストで本番形式に慣れましょう。',
    officialUrl: 'https://mos.odyssey-com.co.jp/',
    applyUrl: 'https://mos.odyssey-com.co.jp/exam/',
    studyLinks: [],
  },
  {
    id: 'cert-python3',
    title: 'Python 3 エンジニア認定基礎試験',
    category: 'プログラミング',
    level: 'プログラミング入門',
    examInfo: 'Odyssey CBT方式（随時受験） / 60分・40問',
    fee: '11,000円（税込）',
    description:
      'Pythonの文法基礎を問う試験で、Python公式チュートリアルを主教材として出題されます。AI・データ分析・業務自動化を学ぶプログラミング初学者のマイルストーンに最適です。',
    advice:
      '出題範囲は「Python公式チュートリアル」に準拠しています。実際にPCでコードを打ちながらチュートリアルを一周したあと、PRIME STUDY・AI資格ドリル・サキトの花などの無料問題集で8〜9割安定して取れる状態になれば合格圏内です。',
    officialUrl: 'https://www.pythonic-exam.com/exam/basic',
    applyUrl: 'https://cbt.odyssey-com.co.jp/pythonic-exam/index.html',
    studyLinks: [
      {
        label: 'Python公式チュートリアル（日本語版・主教材）',
        url: 'https://docs.python.org/ja/3/tutorial/',
      },
      {
        label: 'PRIME STUDY（公式認定・無料模擬試験）',
        url: 'https://study.prime-strategy.co.jp/',
      },
      {
        label: 'AI資格ドリル Python 3 認定基礎 無料問題集',
        url: 'https://aishikakudrill.com/python3-basic',
      },
      {
        label: 'サキトの花 Python 3 認定基礎 問題集（全120問）',
        url: 'https://sakitoo.com/python-basic-mondaishu/',
      },
    ],
  },
  {
    id: 'cert-python3-data',
    title: 'Python 3 エンジニア認定データ分析試験',
    category: 'AI・データサイエンス',
    level: 'データ分析・機械学習入門',
    examInfo: 'Odyssey CBT方式（随時受験） / 60分・40問',
    fee: '11,000円（税込）',
    description:
      'Pythonを使ったデータ分析の基礎力を問う認定試験。データ分析の基礎知識、数学（線形代数・統計）、NumPy・pandas・Matplotlib・scikit-learnなどの主要ライブラリの活用法が出題されます。',
    advice:
      '配点の約7割が「NumPy・pandas・Matplotlib・scikit-learn」のライブラリ実装分野から出題されます。Python基礎を身につけた後、公式主教材を手元に置きつつ、PRIME STUDYやAI資格ドリル・サキトの花の無料模試でメソッドや引数の使い分けを定着させましょう。',
    officialUrl: 'https://www.pythonic-exam.com/exam/analyist',
    applyUrl: 'https://cbt.odyssey-com.co.jp/pythonic-exam/index.html',
    studyLinks: [
      {
        label: 'PRIME STUDY（公式認定・無料模擬試験）',
        url: 'https://study.prime-strategy.co.jp/',
      },
      {
        label: 'AI資格ドリル Python 3 データ分析 無料問題集',
        url: 'https://aishikakudrill.com/python3-data-analysis',
      },
      {
        label: 'サキトの花 Python 3 データ分析 問題集（全120問）',
        url: 'https://sakitoo.com/python-data-analyst-mondaishu/',
      },
    ],
  },
  {
    id: 'cert-g',
    title: 'G検定（ジェネラリスト検定）',
    category: 'AI・データサイエンス',
    level: 'AIリテラシー・DX推進',
    examInfo: 'オンライン自宅受験（年6回開催） / 120分',
    fee: '一般 13,200円（税込）',
    description:
      '日本ディープラーニング協会（JDLA）が実施。AI・ディープラーニングの基礎知識や歴史、ビジネス活用法、法律・倫理観を体系的に理解しているかを認定します。',
    advice:
      '自宅からPCで受験でき、テキストや検索の参照も可能ですが、問題数が非常に多いため「1問30秒」のスピードが勝負です。無料の模擬試験サイトで問題形式に慣れ、よく出る用語のチートシート（一覧表）を自分で整理しておくと安心です。',
    officialUrl: 'https://www.jdla.org/certificate/general/',
    applyUrl: 'https://www.jdla-exam.org/d/',
    studyLinks: [
      {
        label: 'FujiCert G検定 無料問題集・模試（326問）',
        url: 'https://fujicert.jp/g-kentei/',
      },
      {
        label: 'AI資格ドリル G検定 無料模擬試験（200問）',
        url: 'https://dl-drill.com/',
      },
      {
        label: 'G検定無料問題演習（IT資格の森）',
        url: 'https://g-ken-master.com/',
      },
    ],
  },
  {
    id: 'cert-ds',
    title: 'DS検定（データサイエンティスト検定 リテラシーレベル）',
    category: 'AI・データサイエンス',
    level: 'データ活用・統計基礎',
    examInfo: 'CBT方式（年3回実施期間） / 100分・100問',
    fee: '一般 11,000円（税込）',
    description:
      'データサイエンティスト協会が実施。データサイエンス力（統計・数理・機械学習）、データエンジニアリング力（SQL・IT基礎）、ビジネス力の3領域をバランスよく評価します。',
    advice:
      'IT・ビジネス・統計（高校数学〜基礎統計）を幅広く問われます。G検定や基本情報と重なる知識も多いため、公式スキルチェックリストを軸に、無料の問題集サイトで計算問題（確率・統計・SQL）の解き方をパターン化しておくのがおすすめです。',
    officialUrl: 'https://www.datascientist.or.jp/dscertification/',
    applyUrl: 'https://cbt-s.com/examinee/examination/datascientist.html',
    studyLinks: [
      {
        label: 'データサイエンティスト協会 公式対策・例題案内',
        url: 'https://www.datascientist.or.jp/dscertification/preparation/',
      },
      {
        label: 'FujiCert DS検定 無料問題集・模試（283問）',
        url: 'https://fujicert.jp/data-scientist/',
      },
      {
        label: 'AI資格ドリル DS検定 無料予想問題',
        url: 'https://aishikakudrill.com/ds-kentei/',
      },
    ],
  },
]
