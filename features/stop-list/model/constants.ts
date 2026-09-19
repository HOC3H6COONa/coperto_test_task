import type { MenuItemStatus, Shop, StopReason } from '@/types/menu';

export const STOP_REASON_VALUES = [
  'out_of_stock',
  'equipment',
  'quality',
  'menu_change',
] as const satisfies readonly StopReason[];

export const STOP_REASON_LABELS: Record<StopReason, string> = {
  out_of_stock: 'Закончились продукты',
  equipment: 'Сломалось оборудование',
  quality: 'Вопросы к качеству партии',
  menu_change: 'Позиция выведена из меню смены',
};

export const SHOP_LABELS: Record<Shop, string> = {
  kitchen: 'Кухня',
  bar: 'Бар',
  pastry: 'Кондитерская',
};

export const STATUS_LABELS: Record<MenuItemStatus['kind'], string> = {
  available: 'В продаже',
  stopped: 'В стоп-листе',
};
