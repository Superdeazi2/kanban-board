import type { BoardState } from '../types'

export const seedBoard: BoardState = {
  backlog: [
    {
      id: 'task-mobile-check',
      title: 'Проверить мобильную версию',
      description:
        'Убедиться, что карточки и кнопки нормально выглядят на маленьком экране.',
      priority: 'high',
      status: 'backlog',
      createdAt: '2026-08-28T10:20:00.000Z',
      updatedAt: '2026-08-28T10:20:00.000Z',
    },
    {
      id: 'task-copy-cleanup',
      title: 'Почистить тексты',
      description:
        'Сделать подписи короче, понятнее и без ощущения шаблонного интерфейса.',
      priority: 'medium',
      status: 'backlog',
      createdAt: '2026-08-29T14:10:00.000Z',
      updatedAt: '2026-08-29T14:10:00.000Z',
    },
  ],
  progress: [
    {
      id: 'task-drag-polish',
      title: 'Довести drag and drop',
      description:
        'Подправить поведение перетаскивания, чтобы и на телефоне всё было удобно.',
      priority: 'high',
      status: 'progress',
      createdAt: '2026-08-30T09:00:00.000Z',
      updatedAt: '2026-08-31T16:40:00.000Z',
    },
    {
      id: 'task-search-filters',
      title: 'Проверить поиск и фильтры',
      description:
        'Поиск должен быстро находить задачи, а фильтры — не ломать порядок карточек.',
      priority: 'low',
      status: 'progress',
      createdAt: '2026-08-30T11:45:00.000Z',
      updatedAt: '2026-08-31T12:30:00.000Z',
    },
  ],
  done: [
    {
      id: 'task-board-layout',
      title: 'Собрать основу доски',
      description:
        'Подготовить три колонки и аккуратный общий каркас страницы.',
      priority: 'medium',
      status: 'done',
      createdAt: '2026-08-27T08:15:00.000Z',
      updatedAt: '2026-08-30T18:10:00.000Z',
    },
    {
      id: 'task-persistence',
      title: 'Сохранение в браузере',
      description:
        'После перезагрузки изменения остаются, ничего не пропадает.',
      priority: 'low',
      status: 'done',
      createdAt: '2026-08-27T13:25:00.000Z',
      updatedAt: '2026-08-30T18:20:00.000Z',
    },
  ],
}
