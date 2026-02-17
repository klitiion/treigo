// Banned words list for usernames
// Users cannot use these words in their usernames

export const BANNED_WORDS = {
  english: [
    // Admin/System related
    'admin', 'administrator', 'system', 'root', 'moderator', 'mod', 'support', 'staff', 'support_team',
    
    // Common offensive/inappropriate terms
    'fuck', 'shit', 'ass', 'bitch', 'asshole', 'bastard', 'damn', 'crap',
    
    // Hate speech
    'nazi', 'hitler', 'klu', 'kkk', 'racist', 'sexist',
    
    // Sexual content
    'porn', 'xxx', 'sex', 'nude', 'horny', 'slut', 'whore',
    
    // Drug related
    'cocaine', 'heroin', 'meth', 'weed', 'marijuana', 'drugs',
    
    // Common spam/bot usernames
    'bot', 'robot', 'spam', 'spam_bot', 'test', 'test_user', 'demo', 'demo_user',
    
    // Treigo brand/company
    'treigo', 'treigo_official', 'treigo_admin', 'treigo_support',
    
    // Reserved system names
    'api', 'admin_panel', 'dashboard', 'console', 'server', 'website', 'help',
    'about', 'contact', 'privacy', 'terms', 'settings', 'profile', 'account',
    'auth', 'login', 'register', 'signup', 'logout', 'password', 'email',
    'shop', 'store', 'seller', 'buyer', 'product', 'products', 'order', 'orders',
    'payment', 'checkout', 'cart', 'wishlist', 'messages', 'conversations',
    'notifications', 'reviews', 'rating', 'search', 'trending', 'featured',
    
    // Generic abuse
    'abuse', 'harass', 'bully', 'troll', 'scammer', 'fraud', 'fake',
  ],
  
  albanian: [
    // Admin/System related (Albanian)
    'admin', 'administrator', 'sistem', 'rreza', 'moderator', 'mod', 'suport', 'zyrtar', 'ekip',
    
    // Common offensive/inappropriate terms (Albanian)
    'pidh', 'i_pistë', 'i_pistë', 'lavire', 'mallkues', 'shordeh', 'qire',
    
    // Hate speech (Albanian)
    'nazi', 'hitler', 'racista', 'seksista', 'urrim',
    
    // Sexual content (Albanian)
    'pornografi', 'xxx', 'seks', 'nudo', 'natyrisht', 'prostitutë',
    
    // Drug related (Albanian)
    'drogë', 'kokainë', 'heroinë', 'marihuanë', 'hash', 'lsd',
    
    // Common spam/bot usernames (Albanian)
    'bot', 'robot', 'spam', 'test', 'demo', 'shembull',
    
    // Treigo brand/company (Albanian)
    'treigo', 'treigo_zyrtar', 'treigo_admin', 'treigo_suport', 'treigo_ekip',
    
    // Reserved system names (Albanian)
    'api', 'paneli_admin', 'panela_admin', 'dashboard', 'tabela_kontrollit', 'server', 'faqja',
    'ndihme', 'rreth', 'kontakt', ' privatesia', 'kushtet', 'cilesimet', 'profili', 'llogaria',
    'verifikim', 'hyrje', 'regjistrimi', 'nënshkrimi', 'dalja', 'fjalekalimet', 'email',
    'dyqan', 'shitës', 'blerės', 'produkt', 'produkti', 'porosi', 'pagesa', 'shitje',
    'kurora', 'dëshira', 'mesazhe', 'biseda', 'njoftime', 'rishikime', 'vleresimet', 'kerkimi',
    'trending', 'prezantim',
    
    // Generic abuse (Albanian)
    'abuzim', 'ngacmim', 'bullizim', 'troll', 'mashtrues', 'fraud', 'false', 'gënjeshtë',
  ]
}

/**
 * Check if a username contains any banned words
 * @param username The username to check
 * @returns object with isValid flag and warning message if invalid
 */
export function validateUsernameAgainstBannedWords(username: string): {
  isValid: boolean
  warning?: string
} {
  const lowerUsername = username.toLowerCase()
  
  // Check English banned words
  for (const word of BANNED_WORDS.english) {
    if (lowerUsername.includes(word)) {
      return {
        isValid: false,
        warning: `Username contains a prohibited word: "${word}". Please choose a different username.`
      }
    }
  }
  
  // Check Albanian banned words
  for (const word of BANNED_WORDS.albanian) {
    if (lowerUsername.includes(word)) {
      return {
        isValid: false,
        warning: `Emri i përdoruesit përmban një fjalë të ndaluar: "${word}". Ju lutemi zgjidhni një emër tjetër.`
      }
    }
  }
  
  return { isValid: true }
}

/**
 * Validate username format and content
 * @param username The username to validate
 * @returns object with isValid flag and error messages
 */
export function validateUsername(username: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (!username || username.trim().length === 0) {
    errors.push('Username is required')
    return { isValid: false, errors }
  }
  
  const trimmedUsername = username.trim()
  
  // Length validation: 3-20 characters
  if (trimmedUsername.length < 3) {
    errors.push('Username must be at least 3 characters long')
  }
  if (trimmedUsername.length > 20) {
    errors.push('Username must not exceed 20 characters')
  }
  
  // Alphanumeric and underscore only
  if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
    errors.push('Username can only contain letters, numbers, and underscores')
  }
  
  // Cannot start with a number
  if (/^\d/.test(trimmedUsername)) {
    errors.push('Username cannot start with a number')
  }
  
  // Check for banned words
  const bannedWordsCheck = validateUsernameAgainstBannedWords(trimmedUsername)
  if (!bannedWordsCheck.isValid) {
    errors.push(bannedWordsCheck.warning || 'Username contains prohibited content')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
