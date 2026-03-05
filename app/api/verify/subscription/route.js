import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const { user_id } = await request.json();

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Get all required channels
    const { data: requiredChannels, error: channelsError } = await supabase
      .from('required_channels')
      .select('*');

    if (channelsError) {
      return NextResponse.json({ error: channelsError.message }, { status: 500 });
    }

    // If there are no required channels, auto-verify
    if (!requiredChannels || requiredChannels.length === 0) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ is_verified: true })
        .eq('id', user_id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ verified: true, message: 'No required channels. User verified.' });
    }

    // Since we cannot directly verify YouTube subscriptions from the server
    // without a YouTube Data API key + user OAuth consent, we implement a
    // trust-based verification:
    //
    // The user confirms they have subscribed to all required channels by
    // pressing the "Confirm Subscription" button. The API then marks them
    // as verified.
    //
    // For production use with real YouTube API verification, you would:
    // 1. Set up a YouTube Data API v3 key
    // 2. Get the user's YouTube OAuth token
    // 3. Call the subscriptions.list endpoint to check each channel
    //
    // Current implementation: trust-based confirmation
    const { error: updateError } = await supabase
      .from('users')
      .update({ is_verified: true })
      .eq('id', user_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      verified: true,
      message: 'Subscription confirmed. User verified.',
      required_channels: requiredChannels.length,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
