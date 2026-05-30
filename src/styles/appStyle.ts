import { StyleSheet } from "react-native";

// Paleta de colores Rick & Morty Dark Glassmorphism
// Space Black: #0B0C10
// Dark Void: #1A1A1D
// Portal Green: #97CE4C
// Rick Blue: #00B5CC
// Morty Yellow: #F0E14A
// Toxic: #44281D
// Texto Primario: #FFFFFF
// Texto Secundario: rgba(255, 255, 255, 0.6)
// Glass Background: rgba(255, 255, 255, 0.05)

export const loginStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0B0C10",
    padding: 24,
    justifyContent: "center",
  },
  header: { alignItems: "center", marginBottom: 40 },
  emoji: { fontSize: 56, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: "800", color: "#FFFFFF" },
  subtitle: { fontSize: 16, color: "rgba(255, 255, 255, 0.6)", marginTop: 4 },
  form: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(151, 206, 76, 0.2)", // Portal Green traslúcido
    shadowColor: "#97CE4C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  button: { marginTop: 8 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { fontSize: 15, color: "rgba(255, 255, 255, 0.6)" },
  link: { fontSize: 15, color: "#00B5CC", fontWeight: "700" }, // Rick Blue
});

export const registerStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0B0C10",
    padding: 24,
    justifyContent: "center",
  },
  header: { alignItems: "center", marginBottom: 40 },
  emoji: { fontSize: 56, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: "800", color: "#FFFFFF" },
  subtitle: { fontSize: 16, color: "rgba(255, 255, 255, 0.6)", marginTop: 4 },
  form: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(151, 206, 76, 0.2)",
    shadowColor: "#97CE4C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  button: { marginTop: 8 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { fontSize: 15, color: "rgba(255, 255, 255, 0.6)" },
  link: { fontSize: 15, color: "#00B5CC", fontWeight: "700" },
});

export const homeStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0C10" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 73,
    backgroundColor: "rgba(11, 12, 16, 0.85)", // Translúcido para efecto glass
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  greeting: { fontSize: 20, fontWeight: "800", color: "#FFFFFF" },
  email: { fontSize: 13, color: "rgba(255, 255, 255, 0.6)", maxWidth: 220 },
  logoutBtn: {
    backgroundColor: "rgba(68, 40, 29, 0.3)", // Toxic background
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#44281D",
  },
  logoutText: { color: "#F0E14A", fontWeight: "700", fontSize: 14 }, // Morty Yellow
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorEmoji: { fontSize: 56, marginBottom: 12 },
  errorText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
});

export const detailStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0C10" },
  content: { padding: 24 },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  badge: {
    backgroundColor: "rgba(151, 206, 76, 0.1)", // Portal Green muy sutil
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(151, 206, 76, 0.3)",
  },
  badgeText: { fontSize: 13, fontWeight: "700", color: "#97CE4C" }, // Portal Green
  userId: { fontSize: 13, color: "rgba(255, 255, 255, 0.5)" },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 30,
    textTransform: "capitalize",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 20,
  },
  bodyLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#00B5CC", // Rick Blue
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  body: { fontSize: 16, color: "rgba(255, 255, 255, 0.8)", lineHeight: 26 },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorEmoji: { fontSize: 56, marginBottom: 12 },
  errorText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
});

export const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B0C10",
  },
  text: { marginTop: 12, fontSize: 16, color: "#97CE4C" },
});

export const buttonStyles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 25, // Forma de píldora
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#97CE4C", // Portal Green
    shadowColor: "#97CE4C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B0C10", // Contraste fuerte: oscuro sobre verde
  },
});

export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 181, 204, 0.1)", // Borde sutil Rick Blue
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  badge: {
    backgroundColor: "rgba(0, 181, 204, 0.1)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 12, fontWeight: "700", color: "#00B5CC" }, // Rick Blue
  userId: { fontSize: 12, color: "rgba(255, 255, 255, 0.4)" },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    textTransform: "capitalize",
  },
  body: { fontSize: 13, color: "rgba(255, 255, 255, 0.6)", lineHeight: 20 },
});

export const inputStyles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 6,
  },
  inputWrapper: { position: "relative" },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  inputError: { borderColor: "#F0E14A" }, // Morty Yellow para alertas/errores
  eyeIcon: { position: "absolute", right: 14, top: 12 },
  eyeText: { fontSize: 20 },
  errorText: { fontSize: 12, color: "#F0E14A", marginTop: 4 },
});
