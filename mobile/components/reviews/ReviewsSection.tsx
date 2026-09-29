import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { StarRating } from "./StarRating";
import { Colors } from "../../constants/theme";
import { useBrandConfig } from "../../contexts/BrandConfigContext";

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Elena Rostova",
    rating: 5,
    date: "August 2026",
    comment: "Absolutely breathtaking experience. The accommodations were luxury standard and the tour guides were incredibly knowledgeable.",
  },
  {
    id: "r2",
    author: "Marcus Vance",
    rating: 4.8,
    date: "July 2026",
    comment: "Flawless organization from airport transfers to local activities. Everything exceeded our highest expectations.",
  },
  {
    id: "r3",
    author: "Priya Sharma",
    rating: 5,
    date: "June 2026",
    comment: "The family package had thoughtful meal arrangements and great local support throughout the trip.",
  },
];

export function ReviewsSection() {
  const { primaryColor } = useBrandConfig();
  const [reviews, setReviews] = useState<Review[]>(DEFAULT_REVIEWS);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState("");

  const handleAddReview = () => {
    if (!newName.trim() || !newComment.trim()) return;
    const newEntry: Review = {
      id: `r-${Date.now()}`,
      author: newName.trim(),
      rating: newRating,
      date: "Just now",
      comment: newComment.trim(),
    };
    setReviews([newEntry, ...reviews]);
    setNewName("");
    setNewComment("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guest Reviews & Experiences</Text>

      {/* Review List */}
      <View style={styles.list}>
        {reviews.map((item) => (
          <View key={item.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View>
                <Text style={styles.author}>{item.author}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
              <StarRating rating={item.rating} size={14} />
            </View>
            <Text style={styles.comment}>{item.comment}</Text>
          </View>
        ))}
      </View>

      {/* Add Review Box */}
      <View style={styles.addCard}>
        <Text style={styles.addTitle}>Leave a Review</Text>
        <StarRating
          rating={newRating}
          size={22}
          interactive
          onRatingChange={setNewRating}
        />
        <TextInput
          value={newName}
          onChangeText={setNewName}
          placeholder="Your Name"
          placeholderTextColor={Colors.slate400}
          style={styles.input}
        />
        <TextInput
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Share your travel experience..."
          placeholderTextColor={Colors.slate400}
          multiline
          numberOfLines={3}
          style={[styles.input, styles.textArea]}
        />
        <Pressable
          onPress={handleAddReview}
          style={[styles.submitBtn, { backgroundColor: primaryColor }]}
        >
          <Text style={styles.submitBtnText}>Post Review</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.slate900,
  },
  list: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.slate200,
    gap: 8,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  author: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.slate900,
  },
  date: {
    fontSize: 11,
    color: Colors.slate500,
    marginTop: 2,
  },
  comment: {
    fontSize: 13,
    color: Colors.slate700,
    lineHeight: 18,
  },
  addCard: {
    backgroundColor: Colors.slate50,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.slate200,
    gap: 10,
    marginTop: 8,
  },
  addTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.slate900,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: Colors.slate900,
  },
  textArea: {
    height: 70,
    textAlignVertical: "top",
  },
  submitBtn: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
});
