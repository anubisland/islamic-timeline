import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, I18nManager, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const IslamicOrnament = () => (
  <Svg width="40" height="40" viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z" fill="#C5A059" opacity="0.3" />
    <Path d="M12 5L14 10L19 12L14 14L12 19L10 14L5 12L10 10Z" fill="#C5A059" />
  </Svg>
);

export default function App() {
  const [currentLang, setCurrentLang] = useState('AR');

  const toggleLanguage = () => {
    setCurrentLang(currentLang === 'AR' ? 'EN' : 'AR');
  };

  const isAr = currentLang === 'AR';

  return (
    <View style={[styles.container, { direction: isAr ? 'rtl' : 'ltr' }]}>
      <View style={styles.topLeftDecoration}><IslamicOrnament /></View>
      <View style={styles.topRightDecoration}><IslamicOrnament /></View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.langButton} onPress={toggleLanguage}>
            <Text style={styles.langButtonText}>{isAr ? 'English' : 'العربية'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.appTitle}>
            {isAr ? 'الخط الزمني للعهد المدني' : 'The Madani Era Timeline'}
          </Text>
          <View style={styles.goldDivider} />
        </View>

        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>
            {isAr ? '١. بناء المسجد النبوي الشريف' : '1. Building of Al-Masjid an-Nabawi'}
          </Text>
          <Text style={styles.quranVerse}>
            {isAr ? '﴿ لَّمَسْجِدٌ أُسِّسَ عَلَى التَّقْوَىٰ مِنْ أَوَّلِ يَوْمٍ أَحَقُّ أَن تَقُومَ فِيهِ ﴾' : '...A mosque founded on righteousness from the first day is more worthy for you to stand in...'}
          </Text>
          <Text style={styles.eventDescription}>
            {isAr ? 'اللبنة الأولى لتأسيس الدولة الإسلامية وبناء المجتمع بالمدينة المنورة.' : 'The very first pillar in establishing the Islamic state and community in Madinah.'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#063529' },
  scrollContainer: { padding: 24, paddingTop: 60 },
  header: { width: '100%', alignItems: 'flex-end', marginBottom: 20 },
  langButton: { backgroundColor: '#C5A059', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  langButtonText: { color: '#063529', fontWeight: 'bold', fontSize: 14 },
  titleContainer: { alignItems: 'center', marginBottom: 30 },
  appTitle: { color: '#C5A059', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  goldDivider: { width: 100, height: 2, backgroundColor: '#C5A059', marginTop: 10 },
  eventCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, borderLeftWidth: 4, borderLeftColor: '#C5A059' },
  eventTitle: { color: '#063529', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  quranVerse: { color: '#C5A059', fontStyle: 'italic', textAlign: 'center', marginVertical: 10, fontSize: 15 },
  eventDescription: { color: '#555', fontSize: 14, lineHeight: 22 },
  topLeftDecoration: { position: 'absolute', top: 40, left: 10, zIndex: 10 },
  topRightDecoration: { position: 'absolute', top: 40, right: 10, zIndex: 10 }
});
