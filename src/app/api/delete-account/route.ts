import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Récupération des cookies de session
    const cookieStore = await cookies();

    // Client Supabase classique pour vérifier l'utilisateur connecté
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    // On récupère le token de session depuis les cookies
    const allCookies = cookieStore.getAll();
    const authCookie = allCookies.find(c => c.name.includes('auth-token'));

    if (!authCookie) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Client utilisateur pour vérifier l'identité
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          Cookie: allCookies.map(c => `${c.name}=${c.value}`).join('; '),
        },
      },
    });

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 401 });
    }

    // Client admin avec service_role_key pour la suppression
    const supabaseAdmin = createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Suppression des données du profil (table profiles)
    await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', user.id);

    // Suppression de l'entrée waitlist (par email)
    if (user.email) {
      await supabaseAdmin
        .from('waitlist')
        .delete()
        .eq('email', user.email);
    }

    // Suppression définitive de l'utilisateur Auth
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error('Erreur suppression utilisateur:', deleteError);
      return NextResponse.json({ error: 'Erreur de suppression' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Erreur API delete-account:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
