import type {
  FileExplorerFileCategory,
  FileExplorerItem,
  FileExplorerMessages,
  FileExplorerOperation,
} from '@/components/raya/ui/file-explorer'

/**
 * A complete Arabic translation of the File Explorer, used by the docs demo to
 * show `messages` and `dir="rtl"` working together. Arabic has six plural
 * forms; `count` below covers the ones a file manager needs.
 */
function count(n: number, [one, two, few, many, other]: [string, string, string, string, string]) {
  if (n === 1) return one
  if (n === 2) return two
  const mod = n % 100
  if (mod >= 3 && mod <= 10) return `${n} ${few}`
  if (mod >= 11 && mod <= 99) return `${n} ${many}`
  return `${n} ${other}`
}

const items = (n: number) => count(n, ['عنصر واحد', 'عنصران', 'عناصر', 'عنصرًا', 'عنصر'])
const files = (n: number) => count(n, ['ملف واحد', 'ملفان', 'ملفات', 'ملفًا', 'ملف'])
const conflicts = (n: number) => count(n, ['تعارض واحد', 'تعارضان', 'تعارضات', 'تعارضًا', 'تعارض'])

const KINDS: Record<FileExplorerFileCategory, string> = {
  'folder': 'مجلد',
  'image': 'صورة',
  'video': 'فيديو',
  'audio': 'صوت',
  'archive': 'أرشيف',
  'pdf': 'مستند PDF',
  'document': 'مستند',
  'spreadsheet': 'جدول بيانات',
  'presentation': 'عرض تقديمي',
  'code': 'شيفرة',
  'text': 'مستند نصي',
  'font': 'خط',
  '3d': 'نموذج ثلاثي الأبعاد',
  'executable': 'تطبيق',
  'unknown': 'ملف',
}

/** [running, done, failed] */
const VERBS: Record<FileExplorerOperation, [string, string, string]> = {
  upload: ['جارٍ رفع', 'تم رفع', 'تعذّر رفع'],
  download: ['جارٍ تجهيز تنزيل', 'تم تنزيل', 'تعذّر تنزيل'],
  create: ['جارٍ إنشاء', 'تم إنشاء', 'تعذّر إنشاء'],
  rename: ['جارٍ تغيير اسم', 'تم تغيير اسم', 'تعذّر تغيير اسم'],
  delete: ['جارٍ حذف', 'تم حذف', 'تعذّر حذف'],
  trash: ['جارٍ نقل إلى المهملات', 'تم نقل إلى المهملات', 'تعذّر نقل إلى المهملات'],
  restore: ['جارٍ استعادة', 'تمت استعادة', 'تعذّرت استعادة'],
  move: ['جارٍ نقل', 'تم نقل', 'تعذّر نقل'],
  copy: ['جارٍ نسخ', 'تم نسخ', 'تعذّر نسخ'],
  duplicate: ['جارٍ تكرار', 'تم تكرار', 'تعذّر تكرار'],
  share: ['جارٍ مشاركة', 'تمت مشاركة', 'تعذّرت مشاركة'],
  load: ['جارٍ التحميل', 'تم التحميل', 'تعذّر التحميل'],
  search: ['جارٍ البحث', 'تم البحث', 'تعذّر البحث'],
  refresh: ['جارٍ التحديث', 'تم التحديث', 'تعذّر التحديث'],
  other: ['جارٍ العمل على', 'تم الانتهاء من', 'تعذّر إنهاء'],
}

const TIME: Record<string, [string, string, string, string, string]> = {
  minute: ['دقيقة', 'دقيقتين', 'دقائق', 'دقيقة', 'دقيقة'],
  hour: ['ساعة', 'ساعتين', 'ساعات', 'ساعة', 'ساعة'],
  day: ['يوم', 'يومين', 'أيام', 'يومًا', 'يوم'],
  week: ['أسبوع', 'أسبوعين', 'أسابيع', 'أسبوعًا', 'أسبوع'],
  month: ['شهر', 'شهرين', 'أشهر', 'شهرًا', 'شهر'],
  year: ['سنة', 'سنتين', 'سنوات', 'سنة', 'سنة'],
}

const SIZE_UNITS = { B: 'بايت', KB: 'ك.ب', MB: 'م.ب', GB: 'ج.ب', TB: 'ت.ب' } as const

const describe = (list: FileExplorerItem<unknown>[], permanently = false) => {
  const suffix = permanently ? ' نهائيًا' : ''
  const [first] = list
  if (list.length === 1 && first) {
    if (first.type !== 'folder') return `سيُحذف هذا الملف${suffix}.`
    const n = first.children?.length ?? 0
    return n ? `سيُحذف هذا المجلد و${items(n)} بداخله${suffix}.` : `سيُحذف هذا المجلد${suffix}.`
  }
  return `ستُحذف هذه العناصر${suffix}.`
}

const title = (verb: string, list: FileExplorerItem<unknown>[]) => {
  const [first] = list
  return list.length === 1 && first ? `${verb} «${first.name}»؟` : `${verb} ${items(list.length)}؟`
}

export const arabicMessages: FileExplorerMessages = {
  back: 'رجوع',
  forward: 'تقدّم',
  up: 'إلى المجلد الأعلى',
  folderPath: 'مسار المجلد',
  hiddenFolders: 'إظهار المسار المخفي',
  toggleSidebar: 'إظهار شجرة المجلدات أو إخفاؤها',
  filterPlaceholder: 'تصفية الملفات…',
  searchPlaceholder: 'البحث في الملفات…',
  clearFilter: 'مسح التصفية',
  view: 'العرض',
  gridView: 'عرض الشبكة',
  listView: 'عرض التفاصيل',
  sort: 'الترتيب',
  sortBy: column => `الترتيب حسب ${column}`,
  resizeColumn: column => `تغيير عرض ${column}`,
  commandPalette: 'لوحة الأوامر',
  commandPlaceholder: 'ابحث عن إجراء أو مجلد…',
  commandActions: 'الإجراءات',
  commandGoTo: 'الانتقال إلى',
  commandEmpty: 'لا توجد نتائج',
  columnMoved: (column, position, total) => `نُقل ${column} إلى الموضع ${position} من ${total}`,
  ascending: 'تصاعدي',
  descending: 'تنازلي',
  new: 'جديد',
  open: 'فتح',
  preview: 'معاينة',
  download: 'تنزيل',
  newFolder: 'مجلد جديد',
  newFile: 'ملف جديد',
  upload: 'رفع',
  uploadFolder: 'رفع مجلد',
  cut: 'قص',
  copy: 'نسخ',
  paste: 'لصق',
  duplicate: 'تكرار',
  rename: 'إعادة تسمية',
  moveToTrash: 'نقل إلى المهملات',
  delete: 'حذف',
  restore: 'استعادة',
  deletePermanently: 'حذف نهائي',
  emptyTrash: 'إفراغ المهملات',
  share: 'مشاركة',
  copyLink: 'نسخ الرابط',
  addToStarred: 'إضافة إلى المميّزة',
  removeFromStarred: 'إزالة من المميّزة',
  properties: 'الخصائص',
  refresh: 'تحديث',
  retry: 'إعادة المحاولة',
  dismiss: 'إغلاق',
  cancel: 'إلغاء',
  undo: 'تراجع',
  directoryTree: 'شجرة المجلدات',
  folders: 'المجلدات',
  columns: {
    name: 'الاسم',
    modified: 'تاريخ التعديل',
    created: 'تاريخ الإنشاء',
    accessed: 'آخر وصول',
    type: 'النوع',
    size: 'الحجم',
    owner: 'المالك',
    permissions: 'الصلاحية',
  },
  readOnly: 'للقراءة فقط',
  canEdit: 'قابل للتعديل',
  starred: 'مميّز',
  items,
  itemsSelected: n => `تم تحديد ${items(n)}`,
  sizeSelected: size => `${size} محدد`,
  folder: 'مجلد',
  fileKind: (category, extension) => (category === 'unknown' && extension ? `ملف ${extension.toUpperCase()}` : KINDS[category]),
  emptyFolder: 'هذا المجلد فارغ',
  emptyFolderHint: 'أفلت الملفات هنا لرفعها',
  noMatches: query => `لا توجد عناصر تطابق «${query}»`,
  noFiles: 'لا توجد ملفات',
  trashEmpty: 'المهملات فارغة',
  noResults: query => `لا توجد نتائج لـ«${query}»`,
  loading: 'جارٍ التحميل…',
  loadFailed: 'تعذّر تحميل هذا المجلد.',
  searching: 'جارٍ البحث…',
  searchFailed: 'فشل البحث.',
  loadMore: 'تحميل المزيد',
  dropFiles: 'أفلت الملفات',
  dropFilesHint: 'أو انقر للرفع',
  dropToUpload: folder => `أفلت للرفع إلى ${folder}`,
  cannotDropHere: 'لا يمكن الإفلات هنا',
  newName: 'الاسم الجديد',
  nameRequired: 'الاسم مطلوب.',
  nameInvalid: 'لا يمكن أن يحتوي الاسم على / أو \\.',
  nameExists: name => `يوجد عنصر باسم «${name}» هنا بالفعل.`,
  deleteTitle: list => title('حذف', list),
  deleteDescription: list => describe(list),
  deletePermanentlyTitle: list => title('حذف نهائي لـ', list),
  deletePermanentlyDescription: list => `${describe(list, true)} لا يمكن التراجع عن ذلك.`,
  emptyTrashTitle: 'إفراغ المهملات؟',
  emptyTrashDescription: 'سيُحذف كل ما في المهملات نهائيًا. لا يمكن التراجع عن ذلك.',
  conflictTitle: conflict => (conflict.reason === 'exists' ? 'استبدال أم تخطٍّ؟' : `تعذّرت إضافة «${conflict.name}»`),
  conflictDescription: (conflict, target) => {
    if (conflict.message) return conflict.message
    switch (conflict.reason) {
      case 'exists': return `يوجد عنصر باسم «${conflict.name}» في ${target} بالفعل.`
      case 'permission': return `ليست لديك صلاحية إضافة «${conflict.name}» إلى ${target}.`
      case 'invalid-name': return `«${conflict.name}» ليس اسمًا صالحًا في ${target}.`
      case 'into-itself': return `لا يمكن لصق «${conflict.name}» داخل نفسه أو داخل أحد مجلداته.`
      default: return `تعذّرت إضافة «${conflict.name}» إلى ${target}.`
    }
  },
  conflictIncoming: 'الوارد',
  conflictExisting: 'الموجود',
  replace: 'استبدال',
  keepBoth: 'الاحتفاظ بالاثنين',
  skip: 'تخطٍّ',
  applyToAll: n => `طبّق ذلك على ${conflicts(n)} التالية`,
  operations: 'العمليات',
  operationLabel: (type, status, n) => {
    const [running, done, failed] = VERBS[type]
    const subject = type === 'load' || type === 'search' || type === 'refresh' ? '' : ` ${items(n)}`
    if (status === 'error') return `${failed}${subject}`
    if (status === 'canceled') return `أُلغي: ${running}${subject}`
    if (status === 'success') return `${done}${subject}`
    return `${running}${subject}…`
  },
  partialFailure: (failed, total) => `فشل ${failed} من ${total}`,
  filesRejected: n => `لم يُرفع ${files(n)}`,
  fileTooLarge: (name, max) => `حجم ${name} أكبر من ${max}.`,
  fileNotAccepted: name => `نوع ${name} غير مقبول.`,
  moreOperations: n => `+${n} أخرى`,
  justNow: 'الآن',
  timeAgo: (value, unit) => {
    const forms = TIME[unit] ?? TIME.minute!
    // "منذ دقيقة", "منذ دقيقتين", "منذ 5 دقائق"
    return `منذ ${value <= 2 ? forms[value - 1] : count(value, forms)}`
  },
  fileSize: (value, unit) => `${value} ${SIZE_UNITS[unit]}`,
  listSeparator: '، ',
}
