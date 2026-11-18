import type { Locale } from './dictionaries'

export interface AuthStrings {
  signIn: string; createAccount: string
  titleCreate: string; subCreate: string; titleSignIn: string; subSignIn: string
  name: string; country: string; email: string; password: string
  google: string; or: string; forgot: string; wait: string
  submitCreate: string; submitSignIn: string
  verifyTitle: string; verifyBody: string
  resetSent: string; resetPrompt: string
  errFields: string; errPassword: string; errCredentials: string; errGeneric: string; errExists: string
  privacy: string; lockCta: string
  myAccount: string; signOut: string; signedInAs: string
  accountTitle: string; profile: string; save: string; saved: string
  security: string; newPassword: string; updatePassword: string; passwordUpdated: string
  assessments: string; assessmentsSoon: string; addCountry: string
  needSignIn: string; memberSince: string
}

export const authStrings: Record<Locale, AuthStrings> = {
  en: {
    signIn: 'Sign in', createAccount: 'Create account',
    titleCreate: 'Create your VoltSage account', subCreate: 'Free. Unlock every assessment tool and your PDF reports.',
    titleSignIn: 'Welcome back', subSignIn: 'Sign in to open your results and reports.',
    name: 'Full name', country: 'Country', email: 'Email address', password: 'Password',
    google: 'Continue with Google', or: 'or', forgot: 'Forgot password?', wait: 'Please wait…',
    submitCreate: 'Create account', submitSignIn: 'Sign in',
    verifyTitle: 'Check your email', verifyBody: 'We sent a confirmation link to {email}. Open it and this page will unlock automatically.',
    resetSent: 'Password reset link sent. Check your inbox.', resetPrompt: 'Enter your email above first, then tap “Forgot password?”.',
    errFields: 'Please fill in all fields with a valid email.', errPassword: 'Password must be at least 8 characters.',
    errCredentials: 'Incorrect email or password.', errGeneric: 'Something went wrong. Please try again.', errExists: 'An account with this email already exists. Please sign in.',
    privacy: 'We only use your details for your account and to follow up on your solar sizing — no spam.',
    lockCta: 'Sign in to view results',
    myAccount: 'My account', signOut: 'Sign out', signedInAs: 'Signed in as',
    accountTitle: 'My account', profile: 'Profile', save: 'Save changes', saved: 'Saved.',
    security: 'Password', newPassword: 'New password', updatePassword: 'Update password', passwordUpdated: 'Password updated.',
    assessments: 'My assessments', assessmentsSoon: 'Saved assessments and report history are coming soon.', addCountry: 'Add your country',
    needSignIn: 'Sign in to view your account.', memberSince: 'Member since',
  },
  es: {
    signIn: 'Iniciar sesión', createAccount: 'Crear cuenta',
    titleCreate: 'Crea tu cuenta VoltSage', subCreate: 'Gratis. Desbloquea todas las herramientas y tus informes PDF.',
    titleSignIn: 'Bienvenido de nuevo', subSignIn: 'Inicia sesión para abrir tus resultados e informes.',
    name: 'Nombre completo', country: 'País', email: 'Correo electrónico', password: 'Contraseña',
    google: 'Continuar con Google', or: 'o', forgot: '¿Olvidaste tu contraseña?', wait: 'Espera…',
    submitCreate: 'Crear cuenta', submitSignIn: 'Iniciar sesión',
    verifyTitle: 'Revisa tu correo', verifyBody: 'Enviamos un enlace de confirmación a {email}. Ábrelo y esta página se desbloqueará sola.',
    resetSent: 'Enlace de restablecimiento enviado. Revisa tu bandeja.', resetPrompt: 'Escribe primero tu correo y luego toca «¿Olvidaste tu contraseña?».',
    errFields: 'Completa todos los campos con un correo válido.', errPassword: 'La contraseña debe tener al menos 8 caracteres.',
    errCredentials: 'Correo o contraseña incorrectos.', errGeneric: 'Algo salió mal. Inténtalo de nuevo.', errExists: 'Ya existe una cuenta con este correo. Inicia sesión.',
    privacy: 'Solo usamos tus datos para tu cuenta y para dar seguimiento a tu dimensionamiento solar — sin spam.',
    lockCta: 'Inicia sesión para ver los resultados',
    myAccount: 'Mi cuenta', signOut: 'Cerrar sesión', signedInAs: 'Sesión iniciada como',
    accountTitle: 'Mi cuenta', profile: 'Perfil', save: 'Guardar cambios', saved: 'Guardado.',
    security: 'Contraseña', newPassword: 'Nueva contraseña', updatePassword: 'Actualizar contraseña', passwordUpdated: 'Contraseña actualizada.',
    assessments: 'Mis evaluaciones', assessmentsSoon: 'Las evaluaciones guardadas y el historial de informes llegarán pronto.', addCountry: 'Añade tu país',
    needSignIn: 'Inicia sesión para ver tu cuenta.', memberSince: 'Miembro desde',
  },
  pt: {
    signIn: 'Entrar', createAccount: 'Criar conta',
    titleCreate: 'Crie sua conta VoltSage', subCreate: 'Grátis. Libere todas as ferramentas e seus relatórios em PDF.',
    titleSignIn: 'Bem-vindo de volta', subSignIn: 'Entre para abrir seus resultados e relatórios.',
    name: 'Nome completo', country: 'País', email: 'Endereço de e-mail', password: 'Senha',
    google: 'Continuar com o Google', or: 'ou', forgot: 'Esqueceu a senha?', wait: 'Aguarde…',
    submitCreate: 'Criar conta', submitSignIn: 'Entrar',
    verifyTitle: 'Verifique seu e-mail', verifyBody: 'Enviamos um link de confirmação para {email}. Abra-o e esta página será liberada automaticamente.',
    resetSent: 'Link de redefinição enviado. Verifique sua caixa de entrada.', resetPrompt: 'Digite seu e-mail acima e toque em “Esqueceu a senha?”.',
    errFields: 'Preencha todos os campos com um e-mail válido.', errPassword: 'A senha deve ter pelo menos 8 caracteres.',
    errCredentials: 'E-mail ou senha incorretos.', errGeneric: 'Algo deu errado. Tente novamente.', errExists: 'Já existe uma conta com este e-mail. Entre.',
    privacy: 'Usamos seus dados apenas para sua conta e para acompanhar seu dimensionamento solar — sem spam.',
    lockCta: 'Entre para ver os resultados',
    myAccount: 'Minha conta', signOut: 'Sair', signedInAs: 'Conectado como',
    accountTitle: 'Minha conta', profile: 'Perfil', save: 'Salvar alterações', saved: 'Salvo.',
    security: 'Senha', newPassword: 'Nova senha', updatePassword: 'Atualizar senha', passwordUpdated: 'Senha atualizada.',
    assessments: 'Minhas avaliações', assessmentsSoon: 'Avaliações salvas e histórico de relatórios chegam em breve.', addCountry: 'Adicione seu país',
    needSignIn: 'Entre para ver sua conta.', memberSince: 'Membro desde',
  },
  fr: {
    signIn: 'Se connecter', createAccount: 'Créer un compte',
    titleCreate: 'Créez votre compte VoltSage', subCreate: 'Gratuit. Débloquez tous les outils et vos rapports PDF.',
    titleSignIn: 'Bon retour', subSignIn: 'Connectez-vous pour ouvrir vos résultats et rapports.',
    name: 'Nom complet', country: 'Pays', email: 'Adresse e-mail', password: 'Mot de passe',
    google: 'Continuer avec Google', or: 'ou', forgot: 'Mot de passe oublié ?', wait: 'Veuillez patienter…',
    submitCreate: 'Créer un compte', submitSignIn: 'Se connecter',
    verifyTitle: 'Vérifiez votre e-mail', verifyBody: 'Nous avons envoyé un lien de confirmation à {email}. Ouvrez-le et cette page se débloquera automatiquement.',
    resetSent: 'Lien de réinitialisation envoyé. Consultez votre boîte de réception.', resetPrompt: 'Saisissez d’abord votre e-mail, puis touchez « Mot de passe oublié ? ».',
    errFields: 'Remplissez tous les champs avec un e-mail valide.', errPassword: 'Le mot de passe doit contenir au moins 8 caractères.',
    errCredentials: 'E-mail ou mot de passe incorrect.', errGeneric: 'Une erreur est survenue. Réessayez.', errExists: 'Un compte existe déjà avec cet e-mail. Connectez-vous.',
    privacy: 'Nous utilisons vos données uniquement pour votre compte et le suivi de votre dimensionnement solaire — pas de spam.',
    lockCta: 'Connectez-vous pour voir les résultats',
    myAccount: 'Mon compte', signOut: 'Se déconnecter', signedInAs: 'Connecté en tant que',
    accountTitle: 'Mon compte', profile: 'Profil', save: 'Enregistrer', saved: 'Enregistré.',
    security: 'Mot de passe', newPassword: 'Nouveau mot de passe', updatePassword: 'Mettre à jour', passwordUpdated: 'Mot de passe mis à jour.',
    assessments: 'Mes évaluations', assessmentsSoon: 'Les évaluations enregistrées et l’historique des rapports arrivent bientôt.', addCountry: 'Ajoutez votre pays',
    needSignIn: 'Connectez-vous pour voir votre compte.', memberSince: 'Membre depuis',
  },
  de: {
    signIn: 'Anmelden', createAccount: 'Konto erstellen',
    titleCreate: 'VoltSage-Konto erstellen', subCreate: 'Kostenlos. Schalte alle Tools und deine PDF-Berichte frei.',
    titleSignIn: 'Willkommen zurück', subSignIn: 'Melde dich an, um Ergebnisse und Berichte zu öffnen.',
    name: 'Vollständiger Name', country: 'Land', email: 'E-Mail-Adresse', password: 'Passwort',
    google: 'Weiter mit Google', or: 'oder', forgot: 'Passwort vergessen?', wait: 'Bitte warten…',
    submitCreate: 'Konto erstellen', submitSignIn: 'Anmelden',
    verifyTitle: 'E-Mail prüfen', verifyBody: 'Wir haben einen Bestätigungslink an {email} gesendet. Öffne ihn, dann wird diese Seite automatisch freigeschaltet.',
    resetSent: 'Link zum Zurücksetzen gesendet. Prüfe dein Postfach.', resetPrompt: 'Gib oben zuerst deine E-Mail ein und tippe dann auf „Passwort vergessen?“.',
    errFields: 'Bitte alle Felder mit gültiger E-Mail ausfüllen.', errPassword: 'Das Passwort muss mindestens 8 Zeichen haben.',
    errCredentials: 'E-Mail oder Passwort falsch.', errGeneric: 'Etwas ist schiefgelaufen. Bitte erneut versuchen.', errExists: 'Für diese E-Mail existiert bereits ein Konto. Bitte anmelden.',
    privacy: 'Wir verwenden deine Daten nur für dein Konto und die Nachverfolgung deiner Solarplanung — kein Spam.',
    lockCta: 'Anmelden, um Ergebnisse zu sehen',
    myAccount: 'Mein Konto', signOut: 'Abmelden', signedInAs: 'Angemeldet als',
    accountTitle: 'Mein Konto', profile: 'Profil', save: 'Änderungen speichern', saved: 'Gespeichert.',
    security: 'Passwort', newPassword: 'Neues Passwort', updatePassword: 'Passwort aktualisieren', passwordUpdated: 'Passwort aktualisiert.',
    assessments: 'Meine Auswertungen', assessmentsSoon: 'Gespeicherte Auswertungen und Berichtsverlauf folgen bald.', addCountry: 'Land hinzufügen',
    needSignIn: 'Melde dich an, um dein Konto zu sehen.', memberSince: 'Mitglied seit',
  },
}

/** Strings for the free-try gate, the sign-in dialog's context copy, the terms checkbox and the access explainer. */
export interface ExtraStrings {
  trialTitle: string; trialBody: string; advancedTitle: string; advancedBody: string
  benefit1: string; benefit2: string; benefit3: string; benefit4: string
  triesLeft: string; lockTitle: string; lockBody: string
  acceptPre: string; terms: string; and: string; fairUse: string; errTerms: string
  haveAccount: string; noAccount: string
  pdfNote: string; unlockAdvanced: string; switchAdvanced: string
  navTools: string; close: string; passwordHint: string; differentEmail: string
  stepsTitle: string; stepsSub: string
  step1T: string; step1B: string; step2T: string; step2B: string; step3T: string; step3B: string
  stepsCta1: string; stepsCta2: string
  memberTitle: string; memberBody: string
}

export const extraStrings: Record<Locale, ExtraStrings> = {
  en: {
    trialTitle: 'You’ve used your free tries', trialBody: 'Standard assessments are free for {n} tries without an account. Create a free account to keep sizing.',
    advancedTitle: 'Advanced mode is for members', advancedBody: 'Create a free account to unlock custom power overrides, multiple run periods and PDF reports.',
    benefit1: 'Unlimited standard assessments', benefit2: 'Advanced mode: custom power and multiple run periods', benefit3: 'Branded PDF reports to share with installers', benefit4: 'Boujie can run sizing for you in chat',
    triesLeft: '{n} of {max} free tries left', lockTitle: 'Free tries used', lockBody: 'You’ve used your {n} free standard assessments. Create a free account to see results.',
    acceptPre: 'I agree to the', terms: 'Terms of Service', and: 'and', fairUse: 'Fair Use Policy', errTerms: 'Please accept the Terms of Service and Fair Use Policy.',
    haveAccount: 'Already have an account?', noAccount: 'New to VoltSage?',
    pdfNote: 'PDF reports are part of Advanced mode.', unlockAdvanced: 'Create account to unlock', switchAdvanced: 'Switch to Advanced',
    navTools: 'Tools', close: 'Close', passwordHint: 'At least 8 characters', differentEmail: 'Use a different email',
    stepsTitle: 'Try it first. Unlock the rest for free.', stepsSub: 'Standard assessments need no account. A free account adds Advanced mode and PDF reports.',
    step1T: 'Run a standard assessment', step1B: 'Size a home, farm, battery or DC cable. Two free tries, no account.',
    step2T: 'Create a free account', step2B: 'Unlimited standard assessments, plus Advanced mode with custom loads and multiple run periods.',
    step3T: 'Download your report', step3B: 'In Advanced mode, export a branded PDF to compare against any installer quote.',
    stepsCta1: 'Try a standard tool', stepsCta2: 'Create free account',
    memberTitle: 'Sign in to use this tool', memberBody: 'This tool is for VoltSage members. Create a free account or sign in to continue.',
  },
  es: {
    trialTitle: 'Has usado tus pruebas gratuitas', trialBody: 'Las evaluaciones estándar son gratis durante {n} pruebas sin cuenta. Crea una cuenta gratuita para seguir dimensionando.',
    advancedTitle: 'El modo avanzado es para miembros', advancedBody: 'Crea una cuenta gratuita para desbloquear potencias personalizadas, varios periodos de uso e informes PDF.',
    benefit1: 'Evaluaciones estándar ilimitadas', benefit2: 'Modo avanzado: potencia personalizada y varios periodos', benefit3: 'Informes PDF con marca para compartir con instaladores', benefit4: 'Boujie puede dimensionar por ti en el chat',
    triesLeft: 'Te quedan {n} de {max} pruebas gratis', lockTitle: 'Pruebas gratuitas usadas', lockBody: 'Has usado tus {n} evaluaciones estándar gratuitas. Crea una cuenta gratuita para ver los resultados.',
    acceptPre: 'Acepto los', terms: 'Términos del servicio', and: 'y la', fairUse: 'Política de uso justo', errTerms: 'Acepta los Términos del servicio y la Política de uso justo.',
    haveAccount: '¿Ya tienes una cuenta?', noAccount: '¿Nuevo en VoltSage?',
    pdfNote: 'Los informes PDF forman parte del modo avanzado.', unlockAdvanced: 'Crea una cuenta para desbloquear', switchAdvanced: 'Cambiar a avanzado',
    navTools: 'Herramientas', close: 'Cerrar', passwordHint: 'Al menos 8 caracteres', differentEmail: 'Usar otro correo',
    stepsTitle: 'Pruébalo primero. Desbloquea el resto gratis.', stepsSub: 'Las evaluaciones estándar no requieren cuenta. Una cuenta gratuita añade el modo avanzado y los informes PDF.',
    step1T: 'Haz una evaluación estándar', step1B: 'Dimensiona una vivienda, finca, batería o cable CC. Dos pruebas gratis, sin cuenta.',
    step2T: 'Crea una cuenta gratuita', step2B: 'Evaluaciones estándar ilimitadas y modo avanzado con cargas personalizadas y varios periodos.',
    step3T: 'Descarga tu informe', step3B: 'En modo avanzado, exporta un PDF con marca para comparar con cualquier presupuesto.',
    stepsCta1: 'Probar una herramienta estándar', stepsCta2: 'Crear cuenta gratuita',
    memberTitle: 'Inicia sesión para usar esta herramienta', memberBody: 'Esta herramienta es para miembros de VoltSage. Crea una cuenta gratuita o inicia sesión para continuar.',
  },
  pt: {
    trialTitle: 'Você usou suas tentativas gratuitas', trialBody: 'As avaliações padrão são gratuitas por {n} tentativas sem conta. Crie uma conta gratuita para continuar.',
    advancedTitle: 'O modo avançado é para membros', advancedBody: 'Crie uma conta gratuita para liberar potência personalizada, vários períodos de uso e relatórios em PDF.',
    benefit1: 'Avaliações padrão ilimitadas', benefit2: 'Modo avançado: potência personalizada e vários períodos', benefit3: 'Relatórios em PDF com marca para enviar a instaladores', benefit4: 'O Boujie pode dimensionar para você no chat',
    triesLeft: '{n} de {max} tentativas grátis restantes', lockTitle: 'Tentativas gratuitas usadas', lockBody: 'Você usou suas {n} avaliações padrão gratuitas. Crie uma conta gratuita para ver os resultados.',
    acceptPre: 'Concordo com os', terms: 'Termos de Serviço', and: 'e a', fairUse: 'Política de Uso Justo', errTerms: 'Aceite os Termos de Serviço e a Política de Uso Justo.',
    haveAccount: 'Já tem uma conta?', noAccount: 'Novo na VoltSage?',
    pdfNote: 'Os relatórios em PDF fazem parte do modo avançado.', unlockAdvanced: 'Crie uma conta para liberar', switchAdvanced: 'Mudar para avançado',
    navTools: 'Ferramentas', close: 'Fechar', passwordHint: 'Pelo menos 8 caracteres', differentEmail: 'Usar outro e-mail',
    stepsTitle: 'Experimente primeiro. Libere o resto de graça.', stepsSub: 'As avaliações padrão não exigem conta. Uma conta gratuita adiciona o modo avançado e os relatórios em PDF.',
    step1T: 'Faça uma avaliação padrão', step1B: 'Dimensione uma casa, fazenda, bateria ou cabo CC. Duas tentativas grátis, sem conta.',
    step2T: 'Crie uma conta gratuita', step2B: 'Avaliações padrão ilimitadas e modo avançado com cargas personalizadas e vários períodos.',
    step3T: 'Baixe seu relatório', step3B: 'No modo avançado, exporte um PDF com marca para comparar com qualquer orçamento.',
    stepsCta1: 'Testar uma ferramenta padrão', stepsCta2: 'Criar conta gratuita',
    memberTitle: 'Entre para usar esta ferramenta', memberBody: 'Esta ferramenta é para membros da VoltSage. Crie uma conta gratuita ou entre para continuar.',
  },
  fr: {
    trialTitle: 'Vous avez utilisé vos essais gratuits', trialBody: 'Les évaluations standard sont gratuites pendant {n} essais sans compte. Créez un compte gratuit pour continuer.',
    advancedTitle: 'Le mode avancé est réservé aux membres', advancedBody: 'Créez un compte gratuit pour débloquer les puissances personnalisées, plusieurs périodes de fonctionnement et les rapports PDF.',
    benefit1: 'Évaluations standard illimitées', benefit2: 'Mode avancé : puissance personnalisée et plusieurs périodes', benefit3: 'Rapports PDF personnalisés à partager avec les installateurs', benefit4: 'Boujie peut dimensionner pour vous dans le chat',
    triesLeft: '{n} essai(s) gratuit(s) restant(s) sur {max}', lockTitle: 'Essais gratuits utilisés', lockBody: 'Vous avez utilisé vos {n} évaluations standard gratuites. Créez un compte gratuit pour voir les résultats.',
    acceptPre: 'J’accepte les', terms: 'Conditions d’utilisation', and: 'et la', fairUse: 'Politique d’utilisation équitable', errTerms: 'Veuillez accepter les Conditions d’utilisation et la Politique d’utilisation équitable.',
    haveAccount: 'Vous avez déjà un compte ?', noAccount: 'Nouveau sur VoltSage ?',
    pdfNote: 'Les rapports PDF font partie du mode avancé.', unlockAdvanced: 'Créez un compte pour débloquer', switchAdvanced: 'Passer en avancé',
    navTools: 'Outils', close: 'Fermer', passwordHint: 'Au moins 8 caractères', differentEmail: 'Utiliser un autre e-mail',
    stepsTitle: 'Essayez d’abord. Débloquez le reste gratuitement.', stepsSub: 'Les évaluations standard ne demandent aucun compte. Un compte gratuit ajoute le mode avancé et les rapports PDF.',
    step1T: 'Lancez une évaluation standard', step1B: 'Dimensionnez une maison, une ferme, une batterie ou un câble CC. Deux essais gratuits, sans compte.',
    step2T: 'Créez un compte gratuit', step2B: 'Évaluations standard illimitées et mode avancé avec charges personnalisées et plusieurs périodes.',
    step3T: 'Téléchargez votre rapport', step3B: 'En mode avancé, exportez un PDF personnalisé pour comparer avec n’importe quel devis.',
    stepsCta1: 'Essayer un outil standard', stepsCta2: 'Créer un compte gratuit',
    memberTitle: 'Connectez-vous pour utiliser cet outil', memberBody: 'Cet outil est réservé aux membres VoltSage. Créez un compte gratuit ou connectez-vous pour continuer.',
  },
  de: {
    trialTitle: 'Deine kostenlosen Versuche sind aufgebraucht', trialBody: 'Standard-Auswertungen sind {n} Mal ohne Konto kostenlos. Erstelle ein kostenloses Konto, um weiterzumachen.',
    advancedTitle: 'Der erweiterte Modus ist für Mitglieder', advancedBody: 'Erstelle ein kostenloses Konto für eigene Leistungswerte, mehrere Laufzeiten und PDF-Berichte.',
    benefit1: 'Unbegrenzte Standard-Auswertungen', benefit2: 'Erweiterter Modus: eigene Leistung und mehrere Laufzeiten', benefit3: 'PDF-Berichte im VoltSage-Design für Installateure', benefit4: 'Boujie berechnet für dich direkt im Chat',
    triesLeft: 'Noch {n} von {max} kostenlosen Versuchen', lockTitle: 'Kostenlose Versuche verbraucht', lockBody: 'Du hast deine {n} kostenlosen Standard-Auswertungen genutzt. Erstelle ein kostenloses Konto, um Ergebnisse zu sehen.',
    acceptPre: 'Ich stimme den', terms: 'Nutzungsbedingungen', and: 'und der', fairUse: 'Fair-Use-Richtlinie', errTerms: 'Bitte akzeptiere die Nutzungsbedingungen und die Fair-Use-Richtlinie.',
    haveAccount: 'Schon ein Konto?', noAccount: 'Neu bei VoltSage?',
    pdfNote: 'PDF-Berichte gehören zum erweiterten Modus.', unlockAdvanced: 'Konto erstellen zum Freischalten', switchAdvanced: 'Zu Erweitert wechseln',
    navTools: 'Tools', close: 'Schließen', passwordHint: 'Mindestens 8 Zeichen', differentEmail: 'Andere E-Mail verwenden',
    stepsTitle: 'Erst ausprobieren. Den Rest kostenlos freischalten.', stepsSub: 'Standard-Auswertungen brauchen kein Konto. Ein kostenloses Konto bringt den erweiterten Modus und PDF-Berichte.',
    step1T: 'Standard-Auswertung starten', step1B: 'Dimensioniere Haus, Farm, Batterie oder DC-Kabel. Zwei kostenlose Versuche, ohne Konto.',
    step2T: 'Kostenloses Konto erstellen', step2B: 'Unbegrenzte Standard-Auswertungen plus erweiterter Modus mit eigenen Lasten und mehreren Laufzeiten.',
    step3T: 'Bericht herunterladen', step3B: 'Exportiere im erweiterten Modus ein PDF, um jedes Installateurangebot zu vergleichen.',
    stepsCta1: 'Standard-Tool testen', stepsCta2: 'Kostenloses Konto erstellen',
    memberTitle: 'Melde dich an, um dieses Tool zu nutzen', memberBody: 'Dieses Tool ist für VoltSage-Mitglieder. Erstelle ein kostenloses Konto oder melde dich an, um fortzufahren.',
  },
}

/** Strings for the two account types, organisation team management and organisation-only tools. */
const ORG_EN = {
  kindLabel: 'Account type', kindIndividual: 'Individual', kindOrg: 'Organisation',
  kindHintIndividual: 'For one person. Your own login and reports.',
  kindHintOrg: 'For companies. One account, a separate login for each team member.',
  orgName: 'Organisation name', orgNameHint: 'Leave blank if you were invited to join an existing team.',
  errIsOrg: 'This is an organisation account. Choose Organisation above to sign in.',
  errIsIndividual: 'This is an individual account. Choose Individual above to sign in.',
  errOrgName: 'Enter an organisation name (at least 2 characters).',
  acctTypeTitle: 'Account type', typeIndividual: 'Individual account', typeOrg: 'Organisation account',
  typeIndividualBody: 'One person, one login. To add team members and use organisation tools, switch to an organisation account.',
  typeNoOrgBody: 'You have an organisation account but you are not part of an organisation yet. Create one below, or ask your admin to invite {email}.',
  createOrgBtn: 'Create organisation', orgCreated: 'Organisation created.',
  teamTitle: 'Your organisation', seatsUsed: '{n} of {max} seats used', seatsNote: 'Each team member signs in with their own login.',
  inviteEmail: 'Colleague’s email', inviteBtn: 'Invite', inviteSent: 'Invite saved.',
  inviteNote: 'They join automatically when they create an account or sign in on the Organisation tab with this email address.',
  roleAdmin: 'Admin', roleMember: 'Member', invitedTag: 'Invited', you: 'You', removeBtn: 'Remove', revokeBtn: 'Cancel invite',
  seatsFull: 'All seats are in use. Contact info@voltsage.co for an extended arrangement.',
  memberNote: 'You are a member of this organisation. Your admin manages team access.',
  errTeam: 'Something went wrong. Please try again.', errInvalidEmail: 'Enter a valid email address.', errAlreadyMember: 'That person is already on your team.',
  orgOnlyTitle: 'This tool is for organisation accounts',
  orgOnlyBody: 'Network Design is built for installers, EPCs and companies designing systems for clients, so it is part of organisation accounts.',
  orgOnlyCta: 'Set up an organisation account',
}
export type OrgStrings = Record<keyof typeof ORG_EN, string>

// Sign-in dialog and organisation-only wording is translated. The admin-only team panel falls back to English.
export const orgStrings: Record<Locale, OrgStrings> = {
  en: ORG_EN,
  es: { ...ORG_EN, kindLabel: 'Tipo de cuenta', kindIndividual: 'Individual', kindOrg: 'Organización',
    kindHintIndividual: 'Para una persona. Tu propio acceso e informes.', kindHintOrg: 'Para empresas. Una cuenta, con un acceso distinto para cada miembro del equipo.',
    orgName: 'Nombre de la organización', orgNameHint: 'Déjalo en blanco si te invitaron a un equipo existente.',
    errIsOrg: 'Esta es una cuenta de organización. Elige Organización arriba para entrar.', errIsIndividual: 'Esta es una cuenta individual. Elige Individual arriba para entrar.',
    orgOnlyTitle: 'Esta herramienta es para cuentas de organización', orgOnlyBody: 'Network Design está pensada para instaladores, empresas EPC y compañías que diseñan sistemas para clientes, por eso forma parte de las cuentas de organización.', orgOnlyCta: 'Configurar una cuenta de organización' },
  pt: { ...ORG_EN, kindLabel: 'Tipo de conta', kindIndividual: 'Individual', kindOrg: 'Organização',
    kindHintIndividual: 'Para uma pessoa. Seu próprio acesso e relatórios.', kindHintOrg: 'Para empresas. Uma conta, com um acesso separado para cada membro da equipe.',
    orgName: 'Nome da organização', orgNameHint: 'Deixe em branco se foi convidado para uma equipe existente.',
    errIsOrg: 'Esta é uma conta de organização. Escolha Organização acima para entrar.', errIsIndividual: 'Esta é uma conta individual. Escolha Individual acima para entrar.',
    orgOnlyTitle: 'Esta ferramenta é para contas de organização', orgOnlyBody: 'O Network Design foi feito para instaladores, empresas EPC e companhias que projetam sistemas para clientes, por isso faz parte das contas de organização.', orgOnlyCta: 'Configurar uma conta de organização' },
  fr: { ...ORG_EN, kindLabel: 'Type de compte', kindIndividual: 'Individuel', kindOrg: 'Organisation',
    kindHintIndividual: 'Pour une personne. Votre propre accès et vos rapports.', kindHintOrg: 'Pour les entreprises. Un compte, avec un accès distinct pour chaque membre de l’équipe.',
    orgName: 'Nom de l’organisation', orgNameHint: 'Laissez vide si vous avez été invité à rejoindre une équipe existante.',
    errIsOrg: 'Ceci est un compte d’organisation. Choisissez Organisation ci-dessus pour vous connecter.', errIsIndividual: 'Ceci est un compte individuel. Choisissez Individuel ci-dessus pour vous connecter.',
    orgOnlyTitle: 'Cet outil est réservé aux comptes d’organisation', orgOnlyBody: 'Network Design est conçu pour les installateurs, les EPC et les entreprises qui conçoivent des systèmes pour leurs clients ; il fait donc partie des comptes d’organisation.', orgOnlyCta: 'Configurer un compte d’organisation' },
  de: { ...ORG_EN, kindLabel: 'Kontotyp', kindIndividual: 'Einzelperson', kindOrg: 'Organisation',
    kindHintIndividual: 'Für eine Person. Eigener Zugang und eigene Berichte.', kindHintOrg: 'Für Unternehmen. Ein Konto, mit eigenem Login für jedes Teammitglied.',
    orgName: 'Name der Organisation', orgNameHint: 'Leer lassen, wenn du zu einem bestehenden Team eingeladen wurdest.',
    errIsOrg: 'Dies ist ein Organisationskonto. Wähle oben Organisation, um dich anzumelden.', errIsIndividual: 'Dies ist ein Einzelkonto. Wähle oben Einzelperson, um dich anzumelden.',
    orgOnlyTitle: 'Dieses Tool ist für Organisationskonten', orgOnlyBody: 'Network Design richtet sich an Installateure, EPCs und Firmen, die Systeme für Kunden planen, und gehört daher zu den Organisationskonten.', orgOnlyCta: 'Organisationskonto einrichten' },
}
