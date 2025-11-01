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
    
    // Mock settings data
    const settings = {
      store: {
        name: 'Kodmis E-commerce',
        description: 'Modern e-ticaret platformu',
        logo: '/logo.png',
        favicon: '/favicon.ico',
        address: 'İstanbul, Türkiye',
        phone: '+90 212 555 0123',
        email: 'info@kodmis.com',
        website: 'https://kodmis.com',
        taxNumber: '1234567890',
        mersisNumber: '0123456789012345',
        socialMedia: {
          facebook: 'https://facebook.com/kodmis',
          twitter: 'https://twitter.com/kodmis',
          instagram: 'https://instagram.com/kodmis',
          linkedin: 'https://linkedin.com/company/kodmis',
          youtube: 'https://youtube.com/kodmis'
        }
      },
      theme: {
        primaryColor: '#3B82F6',
        secondaryColor: '#64748B',
        accentColor: '#F59E0B',
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937',
        fontFamily: 'Inter',
        fontSize: '16px',
        borderRadius: '8px',
        shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        mode: 'light'
      },
      locale: {
        language: 'tr',
        currency: 'TRY',
        timezone: 'Europe/Istanbul',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24',
        numberFormat: '1.234,56',
        rtl: false
      },
      security: {
        sslEnabled: true,
        corsEnabled: true,
        rateLimitEnabled: true,
        twoFactorRequired: false,
        sessionTimeout: 30,
        passwordPolicy: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSymbols: false
        }
      },
      email: {
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUser: 'noreply@kodmis.com',
        smtpPassword: '********',
        smtpSecure: true,
        fromEmail: 'noreply@kodmis.com',
        fromName: 'Kodmis E-commerce',
        templates: [
          {
            id: 'welcome',
            name: 'Hoş Geldin E-postası',
            subject: '{{store_name}} - Hoş geldiniz!',
            content: 'Merhaba {{customer_name}}, hoş geldiniz!',
            type: 'welcome'
          },
          {
            id: 'order-confirmation',
            name: 'Sipariş Onayı',
            subject: 'Siparişiniz alındı - {{order_number}}',
            content: 'Siparişiniz başarıyla alındı.',
            type: 'order'
          }
        ]
      },
      system: {
        cacheEnabled: true,
        cacheTimeout: 3600,
        logLevel: 'info',
        backupEnabled: true,
        backupFrequency: 'daily',
        maintenanceMode: false,
        systemInfo: {
          version: '1.0.0',
          uptime: '7 gün 14 saat',
          memory: '2.1 GB / 4 GB',
          disk: '45 GB / 100 GB',
          cpu: '15%'
        }
      }
    };

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
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
    
    // Update settings
    console.log('Updating settings:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Settings updated successfully' 
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
