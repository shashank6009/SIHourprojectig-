// Google account data extraction utilities

export interface GoogleUserData {
  name?: string;
  email?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
  verified_email?: boolean;
}

export interface ExtractedGoogleData {
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImage?: string;
  nationality?: string;
}

export class GoogleDataExtractor {
  // Extract data from Google session
  static extractFromSession(session: any): ExtractedGoogleData {
    if (!session?.user) {
      return {};
    }

    const user = session.user;
    const extractedData: ExtractedGoogleData = {};

    // Extract email
    if (user.email) {
      extractedData.email = user.email;
    }

    // Extract profile image
    if (user.image) {
      extractedData.profileImage = user.image;
    }

    // Extract name information
    if (user.name) {
      const nameParts = user.name.split(' ');
      if (nameParts.length >= 2) {
        extractedData.firstName = nameParts[0];
        extractedData.lastName = nameParts.slice(1).join(' ');
      } else if (nameParts.length === 1) {
        extractedData.firstName = nameParts[0];
        extractedData.lastName = '';
      }
    }

    // Extract nationality based on locale (if available)
    if (user.locale) {
      extractedData.nationality = this.getNationalityFromLocale(user.locale);
    }

    console.log('Extracted Google data:', extractedData);
    return extractedData;
  }

  // Map locale to nationality
  private static getNationalityFromLocale(locale: string): string {
    const localeMap: { [key: string]: string } = {
      'en-IN': 'Indian',
      'hi-IN': 'Indian',
      'en-US': 'American',
      'en-GB': 'British',
      'en-CA': 'Canadian',
      'en-AU': 'Australian',
      'fr-FR': 'French',
      'de-DE': 'German',
      'es-ES': 'Spanish',
      'it-IT': 'Italian',
      'pt-BR': 'Brazilian',
      'ja-JP': 'Japanese',
      'ko-KR': 'Korean',
      'zh-CN': 'Chinese',
      'ru-RU': 'Russian',
      'ar-SA': 'Saudi Arabian',
      'th-TH': 'Thai',
      'vi-VN': 'Vietnamese',
      'id-ID': 'Indonesian',
      'ms-MY': 'Malaysian',
      'tl-PH': 'Filipino',
    };

    return localeMap[locale] || 'Indian'; // Default to Indian for PMIS
  }

  // Check if user signed in with Google
  static isGoogleUser(session: any): boolean {
    return session?.user?.image?.includes('googleusercontent.com') || 
           session?.user?.email?.includes('@gmail.com') ||
           session?.user?.name?.includes('Google');
  }

  // Get user's Google profile picture
  static getGoogleProfilePicture(session: any): string | null {
    if (session?.user?.image && session.user.image.includes('googleusercontent.com')) {
      return session.user.image;
    }
    return null;
  }

  // Extract additional Google account info (if available in future)
  static getAdditionalGoogleInfo(session: any): any {
    // This could be expanded to include more Google account data
    // when we have access to additional scopes
    return {
      verifiedEmail: session?.user?.email ? true : false,
      hasProfilePicture: !!session?.user?.image,
      accountType: this.isGoogleUser(session) ? 'Google' : 'Email',
    };
  }
}
