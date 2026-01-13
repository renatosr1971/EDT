
import { Order, OrderStatus } from './types';

export const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: '#EMP-1024',
    customerName: 'Maria Silva',
    customerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8eZMpFr29lxfH8ig2IXoFZBJog7Dgc69SAo0foIfvjKi-zSQDqaH0ewAteERZx94RfID0DFMWAK7y7tnn3vv79AMS9_NugLIu6pqzze6MQ1oYheWDVhqFNZ6RqGnS3cH07nNofxr5_BISlBUtKLZcKnbZoSemn4mKT_dNwViAE_JpBpdhe7o3hinJtijtLdxQWeming_0KxKlWShDf4BniQh72HZg-k86efreOfSEWpBVKvqjbS1fMmj-oqSVWjMVWupE52lGYdEs',
    phone: '(11) 98765-4321',
    address: 'Rua das Flores, 123 - Centro',
    status: OrderStatus.PENDING,
    timestamp: '10m ago',
    itemsSummary: '2x Artisan Bread, 1x Jam',
    deliveryType: 'Retirada',
    pickupDate: '2026-01-15',
    totalValue: 145.00,
    items: [
      { id: 'i1', name: 'Artisan Bread', description: 'Freshly baked', price: 45.0, quantity: 2, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIoXqlwVh0xviBMPsEbHNmvLkdiikTpr0Ji05RAuJdxz5mwleKyE1roIYomlAS5_IUsTAAbHaqNmhqKJZTLatZHhCPQltBFDTiwDmNGQwQqpw-x_f--z_4euyg0tuWBSwC7qWw886Gq8t7DlwlPJxatoElvNPodO61SKtYtKew6dLYG42Mi2Dv4vatEkHL64fjwCdSAtCwrDefAAEr6zL6c6jaOqzs6TFLKjOx8LHCI2chEivdpA8ZjHgd5emQNycT7_Uql-JXfAes' },
      { id: 'i2', name: 'Organic Jam', description: 'Strawberry flavor', price: 55.0, quantity: 1, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoVe9XjTo-ise0jYTv9YXE_ipwkyZk37GPXJVmzx-2XfEwSlynoiKz1HNJ_jpu7DjJfQHjpWCtC9FzeLQcgbMcrL26hyKpe5IkMqUehOjLwya5vSOmavGIzt5WMleoNIYZmKc5mZwT0YVxIUy3HOfQCc2Ol-FB9GxI22NMCAzrSP_bMldrRcMUT2vJ19-XlA6tMTUeTklEY8RRFEbVs1-5CLmwBrAvkr61GE4t0bTxmcM8A6LlpF6j5M9VWiJprfu_6yrjiZQo2blm' }
    ]
  },
  {
    id: '2',
    orderNumber: '#EMP-1023',
    customerName: 'João Santos',
    customerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-0V_ZQ9gSrBEZ8uhuoXOQighue0kwjJ8uJVtBDq9QGYrjGGiNRzYN3EhMT1JQg5lpZ-bWwTQo8jPb0NdkmInklu7UbxhMXmwzC1HZXcM8a5FxU6hQM4otk0IlYKwrFJWJBwLRX3YLzs1_T0yRy0po9HVFTep7_fp2YyX6vtEUCG2ABfHsfXTBuGXf_8zbP9kUFyvB30Hnczog2TKiMTDqwGYqgM6YDkitisv6SB1Cz_8FohQ821S2Dv_Tc67lz5-OGRTzrRlxS4Lw',
    phone: '(11) 91234-5678',
    address: 'Av. Paulista, 1000 - Bela Vista',
    status: OrderStatus.PRODUCTION,
    timestamp: '25m ago',
    itemsSummary: '1x Gift Basket (Custom)',
    deliveryType: 'Entrega',
    pickupDate: '2026-01-16',
    totalValue: 210.00,
    items: [
      { id: 'i3', name: 'Custom Gift Basket', description: 'Assorted items', price: 210.0, quantity: 1, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCONGz7SrLK4-WKsk3AI51_WgT-GPPfEb3BXYW5iWRntenr83xb9BUE_JsrOmjn4zWucHdzvH-1OvW6xzmg68D0nOfzxIxVFo9M0yxSOhNCrT95cGSXPgRBCluEbtyqqhzv7OhBcHKhi-AckJ1GoDHWolYH8aWyDK3ofWlZkjv9fHmdqNYetnT0q-grb6iImk8xhRTHjqQRK6l0JQi9M2nrl9lESWzIbi1lt53QeACQiX9qxyo2J5WEyiBmHrTsqBQtGO3muCFqo-W7' }
    ]
  },
  {
    id: '3',
    orderNumber: '#EMP-1022',
    customerName: 'Ana Costa',
    customerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3fo48W8HZ17gfI_3UdfR_eRfFV_X7BjWUbvnmfyHoFIrzGBT0D6Jgut5C9UEKaQsOaF6TbIcjr8ZPtvT3XaOFsShgI0JcUlVqaG_vH1BVkoTH24eg90kA3eJwzhSxEykMOBVOty5NGfIC4xdWWly2FxOdfWJpdpR4nf7qb4VFFlBFxRzewxo7dKdMnYMvQcgDsU3wZIwaaZybjpYRTBi-HrnKloEc8Gze_M2TpY7VHQxe8LdmQoPj_15G4myTS_1spMy7QTLkWsih',
    phone: '(11) 94444-4444',
    address: 'Rua Augusta, 500 - Consolacao',
    status: OrderStatus.COMPLETED,
    timestamp: '1h ago',
    itemsSummary: '3x Cheese Wheel',
    deliveryType: 'Retirada',
    pickupDate: '2026-01-14',
    totalValue: 270.00,
    items: [
      { id: 'i4', name: 'Cheese Wheel', description: 'Canastra Gold', price: 90.0, quantity: 3, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF-9XyVWFu_7gmGWhaJ1ztB91m0pH6HuAvJFyi1475-UHbxpZGWKIajSYSLXvXYA_5x2CpUUxcDfzmA7XoJQ5CwikMeh84A65utLM3pDCw9Az6VsnPAUKenPwBjltVJhupYv-dxD10HzFPnK8TYIvJ6k8itEfKIZpMEF-05R6QvyOKp9uspE0UXZ4OCv6eanrlwJiDqohy5BKzTPpYlrwDMFNTRkJ_DjZ4GbjNartM6_c30OasunHr2g9-Gn_i-rHRUrrijg5nsaLP' }
    ]
  }
];
