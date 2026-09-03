import { CartItem, Product, FulfillmentOption, Entitlement, Order } from '../types';
import { PRODUCTS_DATA } from '../data/products';

const CART_STORAGE_KEY = 'ocg_lab_cart';
const ENTITLEMENTS_STORAGE_KEY = 'ocg_lab_entitlements';
const ORDERS_STORAGE_KEY = 'ocg_lab_orders';

// Initial seed entitlements for new sessions
const SEED_ENTITLEMENTS: Entitlement[] = [
  {
    id: 'ent-1',
    productId: 'deal-analyzer',
    productTitle: 'Deal Analyzer',
    productType: 'SaaS',
    fulfillmentOption: 'DIY',
    purchaseDate: '2026-08-01',
    status: 'Active',
    licenseKey: 'OCG-DA-884920-PROD',
    accessUrl: '/storefront?product=deal-analyzer'
  },
  {
    id: 'ent-2',
    productId: 'sop-master-blueprint-kit',
    productTitle: 'Standard Operating Procedure (SOP) Master Kit',
    productType: 'SOP Kit',
    fulfillmentOption: 'DIY',
    purchaseDate: '2026-08-05',
    status: 'Active',
    accessUrl: '/resources'
  }
];

const SEED_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'OCG-ORD-984210',
    date: '2026-08-01',
    items: [
      {
        productTitle: 'Deal Analyzer',
        productType: 'SaaS',
        price: 99,
        fulfillmentOption: 'DIY'
      }
    ],
    totalAmount: 99,
    status: 'Completed'
  },
  {
    id: 'ord-102',
    orderNumber: 'OCG-ORD-984211',
    date: '2026-08-05',
    items: [
      {
        productTitle: 'Standard Operating Procedure (SOP) Master Kit',
        productType: 'SOP Kit',
        price: 49,
        fulfillmentOption: 'DIY'
      }
    ],
    totalAmount: 49,
    status: 'Completed'
  }
];

export class CartStore {
  static getCart(): CartItem[] {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  static addToCart(product: Product, fulfillment: FulfillmentOption = 'DIY') {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(
      item => item.product.id === product.id && item.selectedFulfillment === fulfillment
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        product,
        selectedFulfillment: fulfillment,
        quantity: 1
      });
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }

  static removeFromCart(productId: string, fulfillment: FulfillmentOption) {
    const cart = this.getCart().filter(
      item => !(item.product.id === productId && item.selectedFulfillment === fulfillment)
    );
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }

  static clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
  }

  static getEntitlements(): Entitlement[] {
    try {
      const data = localStorage.getItem(ENTITLEMENTS_STORAGE_KEY);
      return data ? JSON.parse(data) : SEED_ENTITLEMENTS;
    } catch (e) {
      return SEED_ENTITLEMENTS;
    }
  }

  static getOrders(): Order[] {
    try {
      const data = localStorage.getItem(ORDERS_STORAGE_KEY);
      return data ? JSON.parse(data) : SEED_ORDERS;
    } catch (e) {
      return SEED_ORDERS;
    }
  }

  static checkoutCart(): { order: Order; newEntitlements: Entitlement[] } {
    const cart = this.getCart();
    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }

    const orderNumber = `OCG-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const dateStr = new Date().toISOString().split('T')[0];

    const orderItems = cart.map(item => ({
      productTitle: item.product.title,
      productType: item.product.type,
      price: item.product.price,
      fulfillmentOption: item.selectedFulfillment
    }));

    const totalAmount = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      date: dateStr,
      items: orderItems,
      totalAmount,
      status: 'Completed'
    };

    const newEntitlements: Entitlement[] = cart.map(item => ({
      id: `ent-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      productId: item.product.id,
      productTitle: item.product.title,
      productType: item.product.type,
      fulfillmentOption: item.selectedFulfillment,
      purchaseDate: dateStr,
      status: item.selectedFulfillment === 'INSTALL IT FOR ME' || item.selectedFulfillment === 'DONE FOR YOU' 
        ? 'Pending Installation' 
        : 'Active',
      licenseKey: `OCG-${item.product.id.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}-KEY`,
      accessUrl: item.product.downloadUrl || `/storefront?product=${item.product.id}`
    }));

    // Save orders & entitlements
    const currentOrders = this.getOrders();
    const currentEntitlements = this.getEntitlements();

    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([newOrder, ...currentOrders]));
    localStorage.setItem(ENTITLEMENTS_STORAGE_KEY, JSON.stringify([...newEntitlements, ...currentEntitlements]));
    
    // Clear cart after successful checkout
    this.clearCart();

    return { order: newOrder, newEntitlements };
  }
}
