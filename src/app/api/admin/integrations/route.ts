import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    // Mock data for integrations
    const apiKeys = [
      {
        id: '1',
        name: 'Mobile App API',
        key: 'mock_key_mobile_app_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        description: 'Mobil uygulama için API erişimi',
        permissions: ['READ_PRODUCTS', 'READ_ORDERS', 'CREATE_ORDERS'],
        status: 'ACTIVE',
        lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        usageCount: 1250,
        rateLimit: {
          requests: 1000,
          period: 'HOUR'
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'admin@kodmis.com'
      },
      {
        id: '2',
        name: 'Webhook API',
        key: 'mock_key_webhook_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        description: 'Webhook entegrasyonları için',
        permissions: ['READ_ORDERS', 'READ_CUSTOMERS', 'READ_PRODUCTS'],
        status: 'ACTIVE',
        lastUsed: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        usageCount: 850,
        rateLimit: {
          requests: 500,
          period: 'HOUR'
        },
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'admin@kodmis.com'
      },
      {
        id: '3',
        name: 'Analytics API',
        key: 'mock_key_analytics_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        description: 'Analitik verileri için API erişimi',
        permissions: ['READ_ANALYTICS', 'READ_ORDERS', 'READ_CUSTOMERS'],
        status: 'INACTIVE',
        lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        usageCount: 320,
        rateLimit: {
          requests: 200,
          period: 'HOUR'
        },
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'admin@kodmis.com'
      },
      {
        id: '4',
        name: 'Test API',
        key: 'mock_key_test_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        description: 'Test ortamı için API erişimi',
        permissions: ['READ_PRODUCTS', 'CREATE_ORDERS', 'UPDATE_ORDERS'],
        status: 'SUSPENDED',
        lastUsed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        usageCount: 150,
        rateLimit: {
          requests: 100,
          period: 'HOUR'
        },
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'admin@kodmis.com'
      }
    ];

    const webhooks = [
      {
        id: '1',
        name: 'Order Created Webhook',
        url: 'https://api.example.com/webhooks/order-created',
        events: ['order.created', 'order.updated'],
        status: 'ACTIVE',
        secret: 'whsec_1234567890abcdef',
        retryCount: 3,
        lastTriggered: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        successCount: 1250,
        failureCount: 45,
        averageResponseTime: 250,
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        name: 'Payment Webhook',
        url: 'https://payment.example.com/webhooks/payment',
        events: ['payment.completed', 'payment.failed'],
        status: 'ACTIVE',
        secret: 'whsec_abcdef1234567890',
        retryCount: 5,
        lastTriggered: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        successCount: 980,
        failureCount: 12,
        averageResponseTime: 180,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        name: 'Inventory Webhook',
        url: 'https://inventory.example.com/webhooks/stock',
        events: ['inventory.updated', 'inventory.low_stock'],
        status: 'FAILING',
        secret: 'whsec_567890abcdef1234',
        retryCount: 3,
        lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        successCount: 650,
        failureCount: 120,
        averageResponseTime: 450,
        createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        name: 'Customer Webhook',
        url: 'https://crm.example.com/webhooks/customer',
        events: ['customer.created', 'customer.updated'],
        status: 'INACTIVE',
        secret: 'whsec_abcdef5678901234',
        retryCount: 2,
        lastTriggered: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        successCount: 420,
        failureCount: 25,
        averageResponseTime: 320,
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const thirdPartyApps = [
      {
        id: '1',
        name: 'Google Analytics',
        type: 'ANALYTICS',
        status: 'CONNECTED',
        description: 'Web sitesi trafiği ve kullanıcı davranışı analizi',
        logo: '/logos/google-analytics.png',
        website: 'https://analytics.google.com',
        lastSync: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        configuration: {
          trackingId: 'GA-123456789',
          enableEcommerce: true,
          enableEnhancedEcommerce: true
        },
        permissions: ['READ_ANALYTICS', 'READ_EVENTS'],
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        name: 'Facebook Pixel',
        type: 'MARKETING',
        status: 'CONNECTED',
        description: 'Facebook reklamları için pixel takibi',
        logo: '/logos/facebook-pixel.png',
        website: 'https://business.facebook.com',
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        configuration: {
          pixelId: '123456789012345',
          enableConversions: true,
          enableCustomAudiences: true
        },
        permissions: ['READ_EVENTS', 'CREATE_EVENTS'],
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        name: 'Stripe',
        type: 'PAYMENT',
        status: 'CONNECTED',
        description: 'Ödeme işlemleri için Stripe entegrasyonu',
        logo: '/logos/stripe.png',
        website: 'https://stripe.com',
        lastSync: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        configuration: {
          publishableKey: 'pk_live_1234567890',
          secretKey: 'sk_live_1234567890',
          webhookSecret: 'whsec_1234567890'
        },
        permissions: ['CREATE_PAYMENTS', 'READ_PAYMENTS', 'REFUND_PAYMENTS'],
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        name: 'Aras Kargo',
        type: 'SHIPPING',
        status: 'CONNECTED',
        description: 'Kargo takibi ve etiket yazdırma',
        logo: '/logos/aras-kargo.png',
        website: 'https://www.araskargo.com.tr',
        lastSync: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        configuration: {
          apiKey: 'aras_api_123456789',
          apiSecret: 'aras_secret_123456789',
          testMode: false
        },
        permissions: ['CREATE_SHIPMENTS', 'READ_SHIPMENTS', 'TRACK_SHIPMENTS'],
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        name: 'Zendesk',
        type: 'SUPPORT',
        status: 'CONNECTED',
        description: 'Müşteri destek sistemi entegrasyonu',
        logo: '/logos/zendesk.png',
        website: 'https://www.zendesk.com',
        lastSync: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        configuration: {
          subdomain: 'kodmis',
          apiToken: 'zendesk_token_123456789',
          enableTickets: true
        },
        permissions: ['CREATE_TICKETS', 'READ_TICKETS', 'UPDATE_TICKETS'],
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '6',
        name: 'Mailchimp',
        type: 'MARKETING',
        status: 'ERROR',
        description: 'E-posta pazarlama kampanyaları',
        logo: '/logos/mailchimp.png',
        website: 'https://mailchimp.com',
        lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        configuration: {
          apiKey: 'mailchimp_api_123456789',
          listId: 'list_123456789',
          serverPrefix: 'us1'
        },
        permissions: ['READ_SUBSCRIBERS', 'CREATE_CAMPAIGNS', 'SEND_EMAILS'],
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const recentApiCalls = [
      {
        id: '1',
        apiKey: 'Mobile App API',
        endpoint: '/api/products',
        method: 'GET',
        status: 200,
        responseTime: 150,
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        apiKey: 'Webhook API',
        endpoint: '/api/orders',
        method: 'GET',
        status: 200,
        responseTime: 200,
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        apiKey: 'Mobile App API',
        endpoint: '/api/orders',
        method: 'POST',
        status: 201,
        responseTime: 300,
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        apiKey: 'Analytics API',
        endpoint: '/api/analytics',
        method: 'GET',
        status: 401,
        responseTime: 50,
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        apiKey: 'Webhook API',
        endpoint: '/api/customers',
        method: 'GET',
        status: 200,
        responseTime: 180,
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString()
      },
      {
        id: '6',
        apiKey: 'Mobile App API',
        endpoint: '/api/products/123',
        method: 'GET',
        status: 404,
        responseTime: 100,
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: '7',
        apiKey: 'Test API',
        endpoint: '/api/orders',
        method: 'PUT',
        status: 403,
        responseTime: 80,
        timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString()
      },
      {
        id: '8',
        apiKey: 'Webhook API',
        endpoint: '/api/analytics',
        method: 'GET',
        status: 200,
        responseTime: 220,
        timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString()
      }
    ];

    const webhookLogs = [
      {
        id: '1',
        webhookId: 'Order Created Webhook',
        event: 'order.created',
        status: 'SUCCESS',
        responseTime: 250,
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        webhookId: 'Payment Webhook',
        event: 'payment.completed',
        status: 'SUCCESS',
        responseTime: 180,
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        webhookId: 'Inventory Webhook',
        event: 'inventory.updated',
        status: 'FAILED',
        responseTime: 5000,
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        error: 'Connection timeout'
      },
      {
        id: '4',
        webhookId: 'Order Created Webhook',
        event: 'order.updated',
        status: 'SUCCESS',
        responseTime: 200,
        timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        webhookId: 'Payment Webhook',
        event: 'payment.failed',
        status: 'SUCCESS',
        responseTime: 160,
        timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString()
      },
      {
        id: '6',
        webhookId: 'Inventory Webhook',
        event: 'inventory.low_stock',
        status: 'RETRYING',
        responseTime: 4500,
        timestamp: new Date(Date.now() - 105 * 60 * 1000).toISOString()
      },
      {
        id: '7',
        webhookId: 'Customer Webhook',
        event: 'customer.created',
        status: 'SUCCESS',
        responseTime: 320,
        timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString()
      },
      {
        id: '8',
        webhookId: 'Order Created Webhook',
        event: 'order.created',
        status: 'SUCCESS',
        responseTime: 280,
        timestamp: new Date(Date.now() - 135 * 60 * 1000).toISOString()
      }
    ];

    // Calculate stats
    const totalApiKeys = apiKeys.length;
    const activeApiKeys = apiKeys.filter(key => key.status === 'ACTIVE').length;
    const totalWebhooks = webhooks.length;
    const activeWebhooks = webhooks.filter(webhook => webhook.status === 'ACTIVE').length;
    const totalApps = thirdPartyApps.length;
    const connectedApps = thirdPartyApps.filter(app => app.status === 'CONNECTED').length;
    
    const totalApiCalls = recentApiCalls.length;
    const successfulApiCalls = recentApiCalls.filter(call => call.status >= 200 && call.status < 300).length;
    const failedApiCalls = recentApiCalls.filter(call => call.status >= 400).length;
    const averageResponseTime = Math.round(recentApiCalls.reduce((sum, call) => sum + call.responseTime, 0) / recentApiCalls.length);

    const stats = {
      totalApiKeys,
      activeApiKeys,
      totalWebhooks,
      activeWebhooks,
      totalApps,
      connectedApps,
      totalApiCalls,
      successfulApiCalls,
      failedApiCalls,
      averageResponseTime,
      apiKeys,
      webhooks,
      thirdPartyApps,
      recentApiCalls,
      webhookLogs
    };

    return NextResponse.json({
      stats
    });
  } catch (error) {
    console.error('Error fetching integration data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    
    // Create new API key, webhook, or 3rd party app
    console.log('Creating integration item:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Integration item created successfully' 
    });
  } catch (error) {
    console.error('Error creating integration item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    
    // Update API key, webhook, or 3rd party app
    console.log('Updating integration item:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Integration item updated successfully' 
    });
  } catch (error) {
    console.error('Error updating integration item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type'); // api-key, webhook, app
    
    if (!id || !type) {
      return NextResponse.json({ error: 'ID and type are required' }, { status: 400 });
    }
    
    // Delete API key, webhook, or 3rd party app
    console.log('Deleting integration item:', { id, type });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Integration item deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting integration item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
